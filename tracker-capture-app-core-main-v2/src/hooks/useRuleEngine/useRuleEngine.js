import { useState, useEffect } from "react";
import { initProgramRules, runProgramRule } from "./ruleEngine";
const useRuleEngine = (data, programMetadata) => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const convertedProgramRules = initProgramRules(
      programMetadata.programRules,
      programMetadata.programRuleVariables
    );
    setRules(convertedProgramRules);
  }, []);

  const run = () => {
    let currentActions = [];
    rules.forEach((programRule) => {
      const { currentTei, currentEnrollment } = data;
      let currentEvent = {};
      if (programRule.programStage) {
        currentEvent = data.currentEvents.find(
          (event) => event.programStage === programRule.programStage.id
        );
      }
      const context = { currentTei, currentEnrollment, currentEvent };
      const actions = runProgramRule(context, programRule);
      currentActions = [...currentActions, ...actions];
    });

    return currentActions;
  };

  return {
    run
  };
};

export default useRuleEngine;
