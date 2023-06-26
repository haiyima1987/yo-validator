import BaseRule from "../BaseRule";

export default class RuleMin extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, minValue) {
    if (minValue === undefined || minValue === null) return true;
    const fieldData = formData[fieldName];
    return parseFloat(fieldData) >= parseFloat(minValue);
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args)
  }
}
