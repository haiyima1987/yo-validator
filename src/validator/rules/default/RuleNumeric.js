import BaseRule from "../BaseRule";

export default class RuleNumeric extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData) {
    const regNumeric = /^[0-9]*$/;
    return super.validateByRegex(fieldName, formData, regNumeric);
  }
}
