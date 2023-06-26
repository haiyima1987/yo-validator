import BaseField from "../fields/BaseField";
import IdGenerator from "../IdGenerator";
import PairRuleHandler from "../rule-handlers/PairRuleHandler";
import EventManager from "../EventManager";
import {EVENT_CROSS_FIELD_ADD, EVENT_CROSS_FIELD_REMOVE, EVENT_PAIR_FIELD_SET_DATA, RULE_REQUIRED} from "../constants";

export default class PairField extends BaseField {
  constructor({id, formId, fieldName, rules, mode, errorMode, delay, formData, setFormData}) {
    super({id, formId, fieldName, rules, mode, errorMode, delay, formData, setFormData});
    this.initialize();
  }

  initialize() {
    this.crossFieldErrors = [];
    this.setEvents();
  }

  setFieldRuleHandlerList() {
    this.isRequired = this.rules.includes(RULE_REQUIRED);
    this.isValid = !this.isRequired;
    this.addPairRuleHandler();
    const ruleDetails = this.rules.split('|');
    /** populate each rule details **/
    ruleDetails.map(details => this.addRuleDetails(details));
  }

  addPairRuleHandler() {
    /** add pair handler to deal with cross field like passwordConfirm **/
    const detailsId = IdGenerator.getId();
    this.ruleHandlerList[detailsId] = new PairRuleHandler({
      id: detailsId,
      formId: this.formId,
      fieldId: this.id,
      fieldName: this.fieldName,
      isRequired: this.isRequired
    });
  }

  /** validate **/
  validateRules() {
    this.setFieldData();
    this.setPairFieldData();
    this.resetErrors();
    const allRulesValid = this.validateRuleList(this.formData);
    this.updateFieldValidStatus(allRulesValid);
    return allRulesValid;
  }

  validateRulesByData(data) {
    this.setPairFieldData();
    /** the data of paired field must be ready before validation process (3) starts **/
    this.resetErrors();
    const allRulesValid = this.validateRuleList(data);
    this.updateFieldValidStatus(allRulesValid);
    return allRulesValid;
  }

  /** inform paired field to set its own data before validating 2 fields **/
  setPairFieldData() {
    /** the data have been set in the main field's handler (CrossRuleHandler) **/
    const fieldData = EventManager.getCrossFieldData(this.formId, this.fieldName);
    if (fieldData) {
      /** if the pair field validation is triggered first, it will set the main field's data for validating 2 fields **/
      EventManager.publish({
        formId: this.formId,
        eventName: `${EVENT_PAIR_FIELD_SET_DATA}-${fieldData.fieldName}`
      });
    }
  }

  /** events for passive error handling **/
  setEvents() {
    EventManager.subscribe({
      formId: this.formId,
      eventName: `${EVENT_PAIR_FIELD_SET_DATA}-${this.fieldName}`,
      handler: this.setFieldData.bind(this)
    });
    EventManager.subscribe({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_ADD}-${this.fieldName}`,
      handler: this.addCrossFieldError.bind(this)
    });
    EventManager.subscribe({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_REMOVE}-${this.fieldName}`,
      handler: this.removeCrossFieldError.bind(this)
    });
  }

  removeEvents() {
    EventManager.unsubscribe({
      formId: this.formId,
      eventName: `${EVENT_PAIR_FIELD_SET_DATA}-${this.fieldName}`
    });
    EventManager.unsubscribe({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_ADD}-${this.fieldName}`
    });
    EventManager.unsubscribe({
      formId: this.formId,
      eventName: `${EVENT_CROSS_FIELD_REMOVE}-${this.fieldName}`
    });
  }

  addCrossFieldError(message) {
    if (!this.crossFieldErrors.includes(message)) {
      this.crossFieldErrors = this.crossFieldErrors.concat(message);
    }
    this.updateOnPassiveError();
  }

  removeCrossFieldError(message) {
    this.crossFieldErrors = this.crossFieldErrors.filter(error => error !== message);
    this.updateOnPassiveError();
  }

  /** status update **/
  updateOnPassiveError() {
    /** here also update form status**/
    this.updateFieldValidStatus(this.checkFieldValid());
    /** here notify the errors in pair field (self) passively **/
    this.notifyErrorField();
  }

  /** get errors self and cross **/
  getErrorMessages() {
    return this.crossFieldErrors.concat(this.errors);
  }

  setCustomField() {
    this.validateRules = this.validateRulesCustom;
    this.setFieldData = this.setFieldDataCustom;
    EventManager.update({
      formId: this.formId,
      eventName: `${EVENT_PAIR_FIELD_SET_DATA}-${this.fieldName}`,
      handler: this.setFieldData.bind(this)
    });
  }

  /** reset errors **/
  resetErrors() {
    this.errors = [];
    this.crossFieldErrors = [];
  }
}
