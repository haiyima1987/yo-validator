import CustomRule from "../rules/CustomRule";

export default class CustomRuleCrossField extends CustomRule {
  constructor({validate, getMessage}) {
    super({validate, getMessage});
  }

  validate(fieldName, formData, args) {
    /** here if data exists is already checked in BaseRuleHandler **/
    return this.validateRule(formData[fieldName], formData[args]);
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args);
  }
}
