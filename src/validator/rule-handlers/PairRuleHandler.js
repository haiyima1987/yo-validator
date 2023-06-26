import BaseRuleHandler from "../rule-handlers/BaseRuleHandler";
import EventManager from "../EventManager";

export default class PairRuleHandler extends BaseRuleHandler {
  constructor({id, formId, fieldId, fieldName, details, isRequired}) {
    super({id, formId, fieldId, fieldName, details, isRequired});
  }

  /** this validateRule is just to notify the main cross field to perform 2-field validation **/
  validateRule(formData) {
    this.isValid = true;
    /** the data have been set in the main field's handler (CrossRuleHandler) **/
    const fieldData = EventManager.getCrossFieldData(this.formId, this.fieldName);
    if (fieldData) {
      /** let the main field validate, update form status, and send errors back to pair field (self) **/
      this.isValid = fieldData.validateRule(formData);
    }
    return this.isValid;
  }

  setMessageHandler() {
    return true;
  }

  setErrormessage() {
    return true;
  }
}
