import BaseRule from "../BaseRule";

export default class RuleConfirm extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, pairFieldName) {
    if (!formData || !fieldName) return false;
    // deal with the case of confirm
    if (pairFieldName) {
      return formData[fieldName] === formData[pairFieldName];
    }
    // check regular password
    return !!formData[fieldName];
  }
}
