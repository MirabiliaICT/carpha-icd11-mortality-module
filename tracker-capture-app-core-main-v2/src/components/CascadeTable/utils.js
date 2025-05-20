import React, { useState, useMemo, useCallback } from "react";
import { generateCode } from "dhis2-uid";
import moment from "moment";
import _ from "lodash";

// const memoizedMetadata = useMemo(() => transformValueSet(a, b), [a, b]);

// const transformValueSet = (metadata) => {
//   // Options
//   return metadata
//     .filter((e) => e.valueSet && e.valueSet.length > 0)
//     .reduce((obj, e) => {
//       obj[e.code] = e.valueSet.reduce((ob, op) => {
//         ob[op.value] = op.label;
//         return ob;
//       }, {});
//       return obj;
//     }, {});
// };

const transformMetadataToColumns = (metadata, locale, dataValuesTranslate) => {
  const cols = [];
  metadata
    .filter((e) => !e.hiddenCol)
    .forEach((ele) => {
      let textFields = !_.isEmpty(ele.translations)
        ? ele.translations[locale]
        : ele.name;
      const colC = {
        dataField: ele.code,
        text: textFields,
      };
      // additionCol
      if (ele.additionCol)
        colC.classes = (cell, row, rowIndex, colIndex) => {
          return "additionCol";
        };

      // Custom classes
      if (ele.classes) colC.classes = ele.classes;
      if (ele.formatter) colC.formatter = ele.formatter;
      if (ele.formatExtraData) colC.formatExtraData = ele.formatExtraData;

      if (ele.valueSet) {
        colC.formatter = (cellContent, row, rowIndex, extraData) => {
          let displayValue = cellContent;

          if (dataValuesTranslate) {
            displayValue = dataValuesTranslate[cellContent]
              ? dataValuesTranslate[cellContent][locale]
                ? dataValuesTranslate[cellContent][locale]
                : cellContent
              : cellContent;
          }
          return displayValue;
        };
      }

      cols.push(colC);
    });
  return cols;
};

const transformD = (metadata, data, dataValuesTranslate, locale) => {
  let d = JSON.parse(JSON.stringify(data));
  console.log(d);

  if (d.id == null) {
    d.id = generateCode();
  }

  metadata.forEach((md) => {
    let displayValue = d[md.code];
    if (dataValuesTranslate) {
      displayValue = dataValuesTranslate[d[md.code]]
        ? dataValuesTranslate[d[md.code]][locale]
          ? dataValuesTranslate[d[md.code]][locale]
          : d[md.code]
        : d[md.code];
    }
    d[md.code] = displayValue;
  });
  return d;
};

const transformData = (metadata, datas, dataValuesTranslate, locale) => {
  let datas_clone = JSON.parse(JSON.stringify(datas));

  // missing uid
  datas_clone.forEach((d) => {
    if (d.id == null) {
      d.id = generateCode();
    }

    metadata
      .filter((e) => e.valueSet && e.valueSet.length > 0)
      .forEach((md) => {
        let displayValue = d[md.code];
        if (dataValuesTranslate) {
          displayValue = dataValuesTranslate[md.code][d[md.code]]
            ? dataValuesTranslate[md.code][d[md.code]][locale]
              ? dataValuesTranslate[md.code][d[md.code]][locale]
              : d[md.code]
            : d[md.code];
        }
        d[md.code] = displayValue;
      });
  });

  return datas_clone;
};

export { transformMetadataToColumns, transformData, transformD };
