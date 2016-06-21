import {
  API_TEXT_FORMATS,
  BOX_TYPES,
} from '../constants.js'

import {
  makeArray,
} from '../utils';

export function getBoxJson({boxes, format, projectKey}) {
  return makeArray(boxes)
    .filter(box => (!!box && !box.deleted && box.type !== BOX_TYPES.LABEL && box.projectKey === projectKey))
    .reduce((result, box) => {
      let value;

      if (format === API_TEXT_FORMATS.HTML && box.html && !box.plainTextOnly) {
        value = box.html;
      } else {
        value = box.text;
      }

      result[box.label] = value;
      
      return result;
    }, {});
}
