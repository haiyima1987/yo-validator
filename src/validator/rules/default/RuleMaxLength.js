import BaseRule from "../BaseRule";

export default class RuleMaxLength extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, length) {
    /** if length isn't provided, then don't validate, return true, let the user know "it doesn't work" **/
    if (!length) return true;
    const fieldData = formData[fieldName];
    return fieldData.length <= length;
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args)
  }
}
