import BaseRule from "../BaseRule";

export default class RuleMax extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, maxValue) {
    if (maxValue === undefined || maxValue === null) return true;
    const fieldData = formData[fieldName];
    return parseFloat(fieldData) <= parseFloat(maxValue);
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args)
  }
}
