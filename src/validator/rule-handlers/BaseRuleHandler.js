import ValidationRules from '../rules/ValidationRules';

export default class BaseRuleHandler {
  constructor({id, formId, fieldId, fieldName, details, isRequired, addErrorMessage}) {
    this.id = id;
    this.formId = formId;
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.isRequired = isRequired;
    this.isValid = !this.isRequired;
    this.addErrorMessage = addErrorMessage;
    this.ruleErrorMessage = '';
    this.setDetailInfo(details);
    this.setMessageHandler();
  }

  setDetailInfo(details) {
    /** here check since PairRuleHandler has no details **/
    if (details) {
      const detailInfo = details.split(':').map(info => info);
      this.ruleName = detailInfo[0];
      this.args = detailInfo[1];
    }
  }

  validateRule(formData) {
    // return true means no validation since the rule is not supported
    if (!this.ruleValidator) return true;
    this.isValid = this.validateData(formData);
    if (!this.isValid) {
      // add error message to parent field class
      this.addErrorMessage(this.ruleErrorMessage);
    }
    return this.isValid;
  }

  validateData(formData) {
    if (!formData || !this.fieldName) return false;
    /** if data don't exist, return true or false depending on isRequired (to show all errors together) **/
    return !formData[this.fieldName] ? !this.isRequired : this.ruleValidator.validate(this.fieldName, formData, this.args);
  }

  setMessageHandler() {
    this.ruleValidator = ValidationRules.getValidator(this.ruleName);
    if (this.ruleValidator && this.ruleValidator.getMessage) {
      this.getErrorMessage = this.getCustomErrorMessages;
    } else {
      this.getErrorMessage = this.fieldName.split('-').length > 1 ? this.getGroupErrorMessages : this.getValidationErrorMessages;
    }
    this.setErrormessage();
  }

  setErrormessage() {
    this.ruleErrorMessage = this.getErrorMessage({
      fieldName: this.fieldName,
      ruleName: this.ruleName,
      args: this.args
    });
  }

  getValidationErrorMessages({fieldName, ruleName, args}) {
    return ValidationRules.getErrorMessage(fieldName, ruleName, args);
  }

  getGroupErrorMessages({fieldName, ruleName, args}) {
    return ValidationRules.getGroupErrorMessage(fieldName, ruleName, args);
  }

  getCustomErrorMessages({fieldName, args}) {
    return this.ruleValidator.getMessage(fieldName, args, ValidationRules.selectedLanguage);
  }
}
