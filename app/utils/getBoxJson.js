import {
  API_TEXT_FORMATS,
  BOX_TYPES,
} from '../constants.js'

import {
  makeArray,
} from '../utils';

export function getBoxJson(boxList, format) {
  return makeArray(boxList)
    .filter(box => (!!box && !box.deleted && box.type !== BOX_TYPES.LABEL))
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
