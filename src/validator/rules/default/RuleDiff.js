import BaseRule from "../BaseRule";

export default class RuleDiff extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, pairFieldName) {
    if (!formData || !fieldName) return false;
    if (pairFieldName) {
      return formData[fieldName] !== formData[pairFieldName];
    }
    return !!formData[fieldName];
  }
}
