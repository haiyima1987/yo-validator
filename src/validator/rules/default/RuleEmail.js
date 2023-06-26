import BaseRule from "../BaseRule";

export default class RuleEmail extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData) {
    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return super.validateByRegex(fieldName, formData, emailRegex);
  }
}
