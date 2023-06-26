import BaseRule from "../BaseRule";

export default class RuleSame extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, pairFieldName) {
    if (!formData || !fieldName) return false;
    // deal with the case of password confirm for instance
    if (pairFieldName) {
      return formData[fieldName] === formData[pairFieldName];
    }
    return !!formData[fieldName];
  }
}
