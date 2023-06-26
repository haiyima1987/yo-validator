import CrossField from "../fields/CrossField";
import EventManager from "../EventManager";
import {EVENT_FIELD_VIEW_UPDATE} from "../constants";

export default class SingleCrossField extends CrossField {
  constructor({id, formId, fieldId, fieldName, rules, errorMode, delay, mode, formData, setFormData}) {
    super({id, formId, fieldId, fieldName, rules, errorMode, delay, mode, formData, setFormData});
  }

  /** field status update **/
  updateFieldValidStatus(isValid) {
    this.isValid = isValid;
    this.isInvalid = !this.isValid;
    /** update view template **/
    this.notifyFieldViewUpdate({isValid: this.isValid, isInvalid: this.isInvalid});
    this.notifyErrorField();
  }

  updateFieldStatus({isDirty, isTouched}) {
    this.isDirty = isDirty ? isDirty : this.isDirty;
    this.isPristine = !this.isDirty;
    this.isTouched = isTouched ? isTouched : this.isTouched;
    this.isUntouched = !this.isTouched;
    const status = {};
    if (this.isDirty) {
      status.isDirty = this.isDirty;
      status.isPristine = this.isPristine;
    }
    if (this.isTouched) {
      status.isTouched = this.isTouched;
      status.isUntouched = this.isUntouched;
    }
    this.notifyFieldViewUpdate(status);
  }

  notifyFieldViewUpdate(data) {
    EventManager.publish({formId: this.formId, eventName: `${EVENT_FIELD_VIEW_UPDATE}-${this.id}`, data});
  }
}
