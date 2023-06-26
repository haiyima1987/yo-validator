import IdGenerator from "../IdGenerator";
import {
  ERROR_MODES,
  EVENT_FORM_STATUS_UPDATE,
  EVENT_FORM_VALID_UPDATE,
  EVENT_INVALID_FIELD,
  RULE_REQUIRED,
  TYPE_EMAIL
} from "../constants";
import EventManager from "../EventManager";
import BaseRuleHandler from "../rule-handlers/BaseRuleHandler";
import InputCreator from "../targets/InputCreator";

export default class BaseField {
  constructor({id, formId, fieldName, rules, mode, errorMode, delay, formData, setFormData}) {
    this.id = id;
    this.formId = formId;
    this.type = '';
    this.fieldName = fieldName;
    /** here keep a reference to the entire form data also for password confirm, the rule checks 2 values **/
    this.formData = formData;
    this.fieldData = {};
    this.rules = rules;
    this.isRequired = this.rules.includes(RULE_REQUIRED);
    this.errorMode = errorMode;
    this.ruleHandlerList = {};
    this.validateRuleList = this.errorMode === ERROR_MODES.ONE ? this.validateSingleRule : this.validateAllRules;
    this.delay = delay;
    this.mode = mode;
    this.input = {};
    /** status **/
    this.isDirty = false;
    this.isPristine = true;
    this.isTouched = false;
    this.isUntouched = true;
    this.isValid = !this.isRequired;
    this.isInvalid = !this.isValid;
    this.setFormData = setFormData;
    this.setFieldRuleHandlerList();
    /** validation **/
    this.errors = [];
  }

  /** rules **/
  setFieldRuleHandlerList() {
    this.isRequired = this.rules.includes(RULE_REQUIRED);
    this.isValid = !this.isRequired;
    const ruleDetails = this.rules.split('|');
    /** populate each rule details **/
    ruleDetails.map(details => this.addRuleDetails(details));
  }

  addRuleDetails(details) {
    if (!details) return;
    const handlerId = IdGenerator.getId();
    this.ruleHandlerList[handlerId] = new BaseRuleHandler({
      id: handlerId,
      formId: this.formId,
      fieldId: this.id,
      fieldName: this.fieldName,
      details,
      isRequired: this.isRequired,
      addErrorMessage: this.addErrorMessage.bind(this)
    });
  }

  modifyRules() {
    if (this.type && this.type.toLowerCase() === TYPE_EMAIL && !this.rules.includes(TYPE_EMAIL)) {
      this.rules = `${this.rules}|${TYPE_EMAIL}`;
      this.addRuleDetails(TYPE_EMAIL);
    }
  }

  /** validate **/
  validateRules() {
    this.setFieldData();
    this.resetErrors();
    /** here use formData for password field **/
    const allRulesValid = this.validateRuleList(this.formData);
    this.updateFieldValidStatus(allRulesValid);
    return allRulesValid;
  }

  validateSingleRule(data) {
    for (const handlerId in this.ruleHandlerList) {
      const ruleHandler = this.ruleHandlerList[handlerId];
      /** validate each single rule, e.g. length:8 **/
      if (!ruleHandler.validateRule(data)) {
        return false;
      }
    }
    return true;
  }

  validateAllRules(data) {
    let allRulesValid = true;
    for (const handlerId in this.ruleHandlerList) {
      const ruleHandler = this.ruleHandlerList[handlerId];
      /** validate each single rule, e.g. length:8 **/
      if (!ruleHandler.validateRule(data)) {
        allRulesValid = false;
      }
    }
    return allRulesValid;
  }

  validateRulesByData(data) {
    this.resetErrors();
    const allRulesValid = this.validateRuleList(data);
    this.updateFieldValidStatus(allRulesValid);
    return allRulesValid;
  }

  /** validate custom field **/
  validateRulesCustom() {
    this.resetErrors();
    /** here use formData for password field **/
    const allRulesValid = this.validateRuleList(this.formData);
    this.updateFieldValidStatus(allRulesValid);
    return allRulesValid;
  }

  checkFieldValid() {
    for (const handlerId in this.ruleHandlerList) {
      const ruleHandler = this.ruleHandlerList[handlerId];
      if (!ruleHandler.isValid) {
        return false;
      }
    }
    return true;
  }

  /** field status update **/
  updateFieldValidStatus(isValid) {
    this.isValid = isValid;
    this.isInvalid = !this.isValid;
    /** update view template **/
    this.notifyFormValidStatus();
    this.notifyErrorField();
  }

  updateFieldStatus({isDirty, isTouched}) {
    this.isDirty = isDirty ? isDirty : this.isDirty;
    this.isPristine = !this.isDirty;
    this.isTouched = isTouched ? isTouched : this.isTouched;
    this.isUntouched = !this.isTouched;
    this.notifyFormStatusUpdate();
  }

  notifyFormStatusUpdate() {
    const status = {};
    if (this.isDirty) {
      status.isDirty = this.isDirty;
      status.isPristine = this.isPristine;
    }
    if (this.isTouched) {
      status.isTouched = this.isTouched;
      status.isUntouched = this.isUntouched;
    }
    /** update view template **/
    EventManager.publish({formId: this.formId, eventName: `${EVENT_FORM_STATUS_UPDATE}-${this.formId}`, data: status});
  }

  notifyFormValidStatus() {
    /** let form to update its status, the form will check if all fields are valid **/
    EventManager.publish({formId: this.formId, eventName: `${EVENT_FORM_VALID_UPDATE}-${this.formId}`});
  }

  /** set field data **/
  setFieldData() {
    const data = this.input.getFieldData();
    this.fieldData = {[this.fieldName]: data};
    /** update form data reference, in each field the data will update as well **/
    this.setFormData({fieldName: this.fieldName, data});
  }

  setFieldDataCustom() {
    /** set data is done separately for custom fields, so here do nothing **/
    return this.fieldData;
  }

  setData(data) {
    this.fieldData = {[this.fieldName]: data};
    /** update form data reference, in each field the data will update as well **/
    this.setFormData({fieldName: this.fieldName, data});
  }

  /** errors **/
  notifyErrorField() {
    EventManager.publish({
      formId: this.formId,
      eventName: `${EVENT_INVALID_FIELD}-${this.id}`,
      data: this.getErrorMessages()
    });
  }

  addErrorMessage(message) {
    if (!this.errors.includes(message)) {
      /** add errors (not cross field) **/
      this.errors = this.errors.concat(message);
    }
  }

  getErrorMessages() {
    return this.errors;
  }

  updateErrorMessages() {
    for (const handlerId in this.ruleHandlerList) {
      const ruleHandler = this.ruleHandlerList[handlerId];
      ruleHandler.setMessageHandler();
    }
  }

  /** update rules **/
  updateRules(rules) {
    this.rules = rules;
    this.ruleHandlerList = {};
    this.setFieldRuleHandlerList();
  }

  /** event target **/
  setEventTarget(targetList) {
    const typeData = targetList[0].type.split('-');
    this.type = typeData[0];
    this.fieldName = !this.fieldName ? targetList[0].name : this.fieldName;
    this.modifyRules();
    this.input = InputCreator.createInput({
      formId: this.formId,
      fieldId: this.id,
      type: this.type,
      mode: this.mode,
      delay: this.delay,
      targetList,
      updateFieldStatus: this.updateFieldStatus.bind(this),
      validateRules: this.validateRules.bind(this)
    });
  }

  setCustomField() {
    this.validateRules = this.validateRulesCustom;
    this.setFieldData = this.setFieldDataCustom;
  }

  /** reset **/
  resetErrors() {
    this.errors = [];
  }

  resetField() {
    this.resetErrors();
    this.notifyErrorField();
  }
}
