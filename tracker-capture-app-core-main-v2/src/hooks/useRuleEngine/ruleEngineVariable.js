import moment from "moment";

const variables = {
  "V{current_date}": `"${moment().format("YYYY-MM-DD")}"`,
  "V{event_date}": "context.currentEvent.eventDate",
  "V{orgunit_code}": "context.currentEvent.orgUnit"
};

const convertBuildInVariables = (condition) => {
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(key, "gi");
    condition = condition.replace(regex, variables[key]);
  });
  return condition;
};

const convertVariables = (condition, programRuleVariables) => {
  programRuleVariables.forEach((prv) => {
    const regex = new RegExp(`#{${prv.name}}`, "gi");
    switch (prv.programRuleVariableSourceType) {
      case "DATAELEMENT_CURRENT_EVENT":
      case "DATAELEMENT_NEWEST_EVENT_PROGRAM":
        condition = condition.replace(
          regex,
          `context.currentEvent.dataValues.${prv.dataElement.id}`
        );
        break;
      case "TEI_ATTRIBUTE":
        condition = condition.replace(
          regex,
          `context.currentTei.attributes.${prv.trackedEntityAttribute.id}`
        );
        break;
      default:
        break;
    }
  });
  return condition;
};

export { convertBuildInVariables, convertVariables };
