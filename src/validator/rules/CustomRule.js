import BaseRule from "./BaseRule";

export default class CustomRule extends BaseRule {
  constructor({validate, getMessage}) {
    super();
    this.validateRule = validate;
    this.getMessage = getMessage;
    this.parseMessage = this.getMessage || this.parseMessage;
  }

  validate(fieldName, formData, args) {
    /** here if data exists is already checked in BaseRuleHandler **/
    return this.validateRule(formData[fieldName], args.split(','));
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args);
  }
}
