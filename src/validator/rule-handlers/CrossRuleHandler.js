import BaseRuleHandler from "../rule-handlers/BaseRuleHandler";
import EventManager from "../EventManager";
import {EVENT_CROSS_FIELD_ADD, EVENT_CROSS_FIELD_REMOVE} from "../constants";

export default class CrossRuleHandler extends BaseRuleHandler {
  constructor({id, formId, fieldId, fieldName, details, isRequired, addCrossFieldError, removeCrossFieldError}) {
    super({id, formId, fieldId, fieldName, details, isRequired});
    this.setEvents();
    this.addCrossFieldError = addCrossFieldError;
    this.removeCrossFieldError = removeCrossFieldError;
  }

  setDetailInfo({ruleName, args}) {
    /** here the args parsed from split() is done in the parent CrossField class **/
    this.ruleName = ruleName;
    this.args = args;
  }

  setEvents() {
    this.pairField = this.args;
    /** this is to let the passive pair field know **/
    EventManager.subscribeCrossField(this.formId, this.pairField, {
      fieldName: this.fieldName,
      ruleName: this.ruleName,
      validateRule: this.validateRule.bind(this)
    });
  }

  removeEvents() {
    /** this is to let the passive pair field know **/
    EventManager.unsubscribeCrossField(this.formId, this.pairField);
  }

  validateRule(formData) {
    // return true means no validation since the rule is not supported
    if (!this.ruleValidator) return true;
    // if validation fails, add error message
    this.isValid = this.validateData(formData);
    if (!this.isValid) {
      /** inform pair field errors **/
      this.sendErrorAdd(this.ruleErrorMessage);
      /** add self field errors, self is a cross field as well **/
      this.addCrossFieldError(this.ruleErrorMessage);
      return false;
    }
    /** inform pair field errors **/
    this.sendErrorRemove(this.ruleErrorMessage);
    /** remove self field errors **/
    this.removeCrossFieldError(this.ruleErrorMessage);
    return true;
  }

  setErrormessage() {
    this.ruleErrorMessage = this.getErrorMessage({
      fieldName: this.fieldName,
      ruleName: this.ruleName,
      args: this.pairField
    });
  }

  sendErrorAdd(message) {
    EventManager.publish({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_ADD}-${this.pairField}`,
      data: message
    });
  }

  sendErrorRemove(message) {
    EventManager.publish({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_REMOVE}-${this.pairField}`,
      data: message
    });
  }
}
