import PairField from "../fields/PairField";
import IdGenerator from "../IdGenerator";
import {
  EVENT_CROSS_FIELD_ADD,
  EVENT_CROSS_FIELD_REMOVE,
  EVENT_PAIR_FIELD_SET_DATA,
  INDICATOR_CROSS_FIELD,
  RULE_REQUIRED
} from "../constants";
import CrossRuleHandler from "../rule-handlers/CrossRuleHandler";
import BaseRuleHandler from "../rule-handlers/BaseRuleHandler";
import EventManager from "../EventManager";

export default class CrossField extends PairField {
  constructor({id, formId, fieldId, fieldName, rules, errorMode, delay, mode, formData, setFormData}) {
    super({id, formId, fieldId, fieldName, rules, errorMode, delay, mode, formData, setFormData});
  }

  initialize() {
    this.crossFieldErrors = [];
    this.setEvents();
  }

  setFieldRuleHandlerList() {
    this.isRequired = this.rules.includes(RULE_REQUIRED);
    this.isValid = !this.isRequired;
    const ruleDetails = this.rules.split('|');
    /** populate each rule details **/
    ruleDetails.map(details => this.addRuleDetails(details));
  }

  addRuleDetails(details) {
    const detailsId = IdGenerator.getId();
    /** details, e.g. crossField:passwordConfirm **/
    if (details.includes(INDICATOR_CROSS_FIELD)) {
      this.ruleHandlerList[detailsId] = new CrossRuleHandler({
        id: detailsId,
        formId: this.formId,
        fieldId: this.id,
        fieldName: this.fieldName,
        details: this.getDetailInfo(details),
        isRequired: this.isRequired,
        addCrossFieldError: this.addCrossFieldError.bind(this),
        removeCrossFieldError: this.removeCrossFieldError.bind(this)
      });
    } else {
      /** details, e.g. minLength:8 **/
      this.ruleHandlerList[detailsId] = new BaseRuleHandler({
        id: detailsId,
        formId: this.formId,
        fieldId: this.id,
        fieldName: this.fieldName,
        details,
        isRequired: this.isRequired,
        addErrorMessage: this.addErrorMessage.bind(this)
      });
    }
  }

  getDetailInfo(details) {
    const detailInfo = details.split(':').map(info => info);
    const ruleName = detailInfo[0];
    const args = detailInfo[1].split(INDICATOR_CROSS_FIELD)[1];
    this.addPairField(args);
    return {ruleName, args};
  }

  addPairField(fieldName) {
    this.pairFields = this.pairFields || [];
    if (!this.pairFields.includes(fieldName)) {
      /** store pair field names **/
      this.pairFields = this.pairFields.concat(fieldName);
    }
  }

  /** set pair data for validating 2 fields **/
  setPairFieldData() {
    for (const fieldKey in this.pairFields) {
      const fieldName = this.pairFields[fieldKey];
      EventManager.publish({formId: this.formId, eventName: `${EVENT_PAIR_FIELD_SET_DATA}-${fieldName}`});
    }
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
    /** remove events from rule handlers **/
    for (const handlerKey in this.ruleHandlerList) {
      const handler = this.ruleHandlerList[handlerKey];
      if (handler.removeEvents) {
        handler.removeEvents();
      }
    }
  }
}
