import moment from "moment";

const daysBetween = (startDate, endDate) => {
  startDate = moment(startDate);
  endDate = moment(endDate);
  return startDate.diff(endDate, "days");
};
const yearsBetween = (startDate, endDate) => {
  startDate = moment(startDate);
  endDate = moment(endDate);
  return startDate.diff(endDate, "years");
};
const monthsBetween = (startDate, endDate) => {
  startDate = moment(startDate);
  endDate = moment(endDate);
  return startDate.diff(endDate, "months");
};
const weeksBetween = (startDate, endDate) => {
  startDate = moment(startDate);
  endDate = moment(endDate);
  return startDate.diff(endDate, "weeks");
};

const hasValue = (value) => {
  if (value) return true;
  if (!value) return false;
};

const functions = {
  "d2:daysBetween": "daysBetween",
  "d2:yearsBetween": "yearsBetween",
  "d2:monthsBetween": "monthsBetween",
  "d2:weeksBetween": "weeksBetween",
  "d2:hasValue": "hasValue"
};

const convertBuildInFuctions = (condition) => {
  Object.keys(functions).forEach((key) => {
    const regex = new RegExp(key, "gi");
    condition = condition.replace(regex, functions[key]);
  });
  return condition;
};

export { convertBuildInFuctions, daysBetween, yearsBetween, monthsBetween, weeksBetween, hasValue };
