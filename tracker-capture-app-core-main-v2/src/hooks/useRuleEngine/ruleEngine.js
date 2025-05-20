import { convertBuildInVariables, convertVariables } from "./ruleEngineVariable";

import {
  convertBuildInFuctions,
  daysBetween,
  yearsBetween,
  monthsBetween,
  weeksBetween,
  hasValue
} from "./ruleEngineFunction";

const functionNames = ["daysBetween", "yearsBetween", "monthsBetween", "weeksBetween", "hasValue"];
const functions = [daysBetween, yearsBetween, monthsBetween, weeksBetween, hasValue];

const runBaseValueCheck = (dataItem, value, t) => {
  if (!value && compulsory) {
    return { status: false, message: t("thisFieldIsRequired") };
  }
  if (!value) return true;
  switch (dataItem.valueType) {
    case "INTEGER":
      if (isNaN(value) || value > 999999999 || value < -999999999) {
        return { status: false, message: t("valueMustBeInteger") };
      }
      break;
    case "NUMBER":
      if (isNaN(value) || value > 99999999999999999999 || value < -99999999999999999999) {
        return { status: false, message: t("valueMustBeNumber") };
      }
      break;
    case "PERCENTAGE":
      if (isNaN(value) || value > 100 || value < 0) {
        return {
          status: false,
          message: t("valueMustBeBetween0And100")
        };
      }
      break;
    case "INTEGER_POSITIVE":
      if (isNaN(value) || value > 999999999 || value < 1) {
        return {
          status: false,
          message: t("valueMustBePositiveInteger")
        };
      }
      break;
    case "INTEGER_NEGATIVE":
      if (isNaN(value) || value > -1 || value < -999999999) {
        return {
          status: false,
          message: t("valueMustBeNegativeInteger")
        };
      }
      break;
    case "INTEGER_ZERO_OR_POSITIVE ":
      if (isNaN(value) || value > 999999999 || value < 0) {
        return {
          status: false,
          message: t("valueMustBeZeroOrPositiveInteger")
        };
      }
      break;
    case "PHONE_NUMBER ":
      if (isNaN(value)) {
        return { status: false, message: t("valueMustBePhoneNumber") };
      }
      break;
    case "EMAIL":
      // eslint-disable-next-line
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(value).toLowerCase())) {
        return { status: false, message: t("valueMustBeEmail") };
      }
      break;
    case "COORDINATES":
    case "UNIT_INTERVAL":
    case "FILE_RESOURCE":
    case "LETTER":
    case "IMAGE":
    case "URL":
    case "USERNAME":
      return {
        status: false,
        message: t("unsupportedValueType") + " " + dataItem.valueType
      };
    default:
      return true;
  }
  return true;
};

const generateAction = (result, action) => {
  let actions = [];
  /*
      "DISPLAYTEXT",
      "DISPLAYKEYVALUEPAIR",
      "HIDEFIELD",
      "HIDESECTION",
      "HIDEPROGRAMSTAGE",
      "ASSIGN",
      "SHOWWARNING",
      "WARNINGONCOMPLETE",
      "SHOWERROR",
      "ERRORONCOMPLETE",
      "CREATEEVENT",
      "SETMANDATORYFIELD",
      "SENDMESSAGE",
      "SCHEDULEMESSAGE",
      "HIDEOPTION",
      "SHOWOPTIONGROUP",
      "HIDEOPTIONGROUP"
    */
  const dataElementId = action.dataElement ? action.dataElement.id : null;
  const trackedEntityAttributeId = action.trackedEntityAttribute ? action.trackedEntityAttribute.id : null;
  const target = dataElementId ? dataElementId : trackedEntityAttributeId ? trackedEntityAttributeId : null;
  const targetType = dataElementId ? "de" : trackedEntityAttributeId ? "tea" : null;
  switch (action.programRuleActionType) {
    case "HIDEFIELD":
      actions.push({
        type: "HIDEFIELD",
        target,
        targetType
      });
      actions.push({
        type: "ASSIGN",
        target,
        targetType,
        value: ""
      });
      break;
    case "ASSIGN":
      actions.push({
        type: "ASSIGN",
        target,
        targetType,
        value: action.data
        // value: evaluate(currentEvent, action.data)
      });
      break;
    case "SHOWERROR":
      actions.push({
        type: "SHOWERROR",
        target,
        targetType,
        content: action.content
      });
      break;
    case "SHOWWARNING":
      actions.push({
        type: "SHOWWARNING",
        target,
        targetType,
        value: action.content
      });
      break;
    case "HIDEOPTION":
      actions.push({
        type: "HIDEOPTION",
        target,
        targetType,
        optionCode: action.option.code
      });
      break;
    case "HIDEOPTIONGROUP":
      actions.push({
        type: "HIDEOPTIONGROUP",
        target,
        targetType,
        optionCodes: action.optionGroup.options.map((option) => option.code)
      });
      break;
    default:
      break;
  }
  return actions;
};

const runProgramRule = (context, programRule) => {
  let actions = [];
  const result = evaluate(context, programRule.condition);
  if (result === true) {
    programRule.programRuleActions.forEach((pra) => {
      actions = [...actions, ...generateAction(result, pra)];
    });
  }
  return actions;
};

const convertExpression = (expression, programRulesVariables) => {
  //CONVERT NORMAL programRulesVariables
  expression = convertVariables(expression, programRulesVariables);

  //CONVERT BUILT-IN VARIABLES
  expression = convertBuildInVariables(expression);

  //CONVERT BUILT-IN FUNCTIONS
  expression = convertBuildInFuctions(expression);
  return expression;
};

const evaluate = (context, expression) => {
  // eslint-disable-next-line no-unused-vars
  let valid = true;
  try {
    console.log(`Evaluating: ${expression}`);
    eval(expression);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err);
      valid = false;
    }
  } finally {
    if (valid) {
      const evaluationFunction = new Function(
        ["context", ...functionNames],
        `
         const result = ${expression};
         return result;
        `
      );
      return evaluationFunction(context, ...functions);
    } else {
      return false;
    }
  }
};

const initProgramRules = (programRules, programRuleVariables) => {
  const convertedProgramRules = programRules.map((pr) => {
    pr.condition = convertExpression(pr.condition, programRuleVariables);
    pr.programRuleActions.forEach((action, index) => {
      if (action.programRuleActionType === "ASSIGN") {
        action.data = convertExpression(action.data, programRuleVariables);
        pr.programRuleActions[index] = action;
      }
    });
    return pr;
  });
  return convertedProgramRules;
};

export { runBaseValueCheck, runProgramRule, initProgramRules };
