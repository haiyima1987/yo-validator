import BaseField from "../fields/BaseField";
import {EVENT_FIELD_VIEW_UPDATE, EVENT_INVALID_FIELD} from "../constants";
import EventManager from "../EventManager";

export default class SingleField extends BaseField {
  constructor({id, formId, fieldName, rules, mode, errorMode, delay, formData, setFormData}) {
    super({id, formId, fieldName, rules, mode, errorMode, delay, formData, setFormData});
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

  /** errors **/
  notifyErrorField() {
    EventManager.publish({
      formId: this.formId,
      eventName: `${EVENT_INVALID_FIELD}-${this.id}`,
      data: this.getErrorMessages()
    });
  }
}
