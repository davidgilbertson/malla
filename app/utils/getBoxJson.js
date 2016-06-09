import forOwn from 'lodash/forOwn';

import {
  API_TEXT_FORMATS,
  BOX_TYPES,
} from '../constants.js'

export function getBoxJson(boxes, format) {
  const result = {};

  forOwn(boxes, box => {
    if (box && !box.deleted && box.type !== BOX_TYPES.LABEL) {
      let value;

      if (format === API_TEXT_FORMATS.HTML && box.html) {
        value = box.html;
      } else {
        value = box.text;
      }

      result[box.label] = value;
    }
  });

  return result;
}
