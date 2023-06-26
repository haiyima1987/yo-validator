import {EVENT_FORM_STATUS_UPDATE, EVENT_FORM_VALID_UPDATE, EVENT_FORM_VIEW_UPDATE} from "../constants";
import Form from "../targets/Form";
import IdGenerator from "../IdGenerator";
import EventManager from "../EventManager";
import FieldCreator from "../fields/FieldCreator";

export default class BaseForm {
  constructor(formId, name, errorMode, valid) {
    this.id = formId;
    this.errorMode = errorMode;
    this.name = name;
    this.fields = {};
    this.formData = {};
    this.form = {};
    this.mode = '';
    /** status **/
    this.isDirty = false;
    this.isPristine = true;
    this.isTouched = false;
    this.isUntouched = true;
    this.isValid = valid !== undefined && valid !== null ? valid : true;
    this.isInvalid = !this.isValid;
    this.setEvents();
  }

  /** set data **/
  setFormData({fieldName, data}) {
    /** update the entire form data (modify original object so children will have a reference **/
    this.formData[fieldName] = data;
  }

  setFieldListData() {
    for (const fieldId in this.fields) {
      const field = this.fields[fieldId];
      field.setFieldData();
    }
  }

  setFieldDataByFieldId(fieldId, data) {
    this.fields[fieldId].setData(data);
  }

  /** add rule field **/
  addFormField({fieldId, formId, fieldName, rules, isCrossField, delay, mode, errorMode}) {
    this.fields[fieldId] = FieldCreator.createField({
      id: fieldId,
      formId,
      fieldName,
      rules,
      isCrossField,
      delay,
      errorMode: errorMode ? errorMode : this.errorMode,
      mode: mode ? mode : this.mode,
      formData: this.formData,
      setFormData: this.setFormData.bind(this)
    });
    return {field: this.fields[fieldId]};
  }

  /** validate: 1. set data 2. validate all rules 3. update status messages **/
  validateFormFields() {
    /** 1 set data **/
    this.setFieldListData();
    let isFormValid = true;
    for (const fieldId in this.fields) {
      const field = this.fields[fieldId];
      /** 2 validate **/
      if (!field.validateRulesByData(this.formData)) {
        isFormValid = false;
      }
    }
    /** 3 update statuses **/
    this.updateValidStatus(isFormValid);
    return {isFormValid, formData: this.formData};
  }

  validateField(fieldId) {
    const field = this.fields[fieldId];
    const isValid = field.validateRules();
    this.updateValidStatus(this.checkFormValid());
    return isValid;
  }

  validateFieldByData(fieldId, data) {
    const field = this.fields[fieldId];
    const parsedData = {[field.fieldName]: data};
    return field.validateRulesByData(parsedData);
  }

  checkFormValid() {
    for (const fieldKey in this.fields) {
      const field = this.fields[fieldKey];
      if (!field.isValid) {
        return false;
      }
    }
    return true;
  }

  /** form valid status update **/
  /** case 1: user clicks submit to validate all, then isValid is passed as param (form status update) **/
  updateValidStatus(isValid) {
    this.isValid = isValid;
    /** update view template **/
    this.notifyFormViewUpdate({isValid: this.isValid, isInvalid: !this.isValid});
  }

  notifyFormViewUpdate(data) {
    EventManager.publish({formId: this.id, eventName: `${EVENT_FORM_VIEW_UPDATE}-${this.id}`, data});
  }

  handleFormValidStatus() {
    const isValid = this.checkFormValid();
    this.notifyFormViewUpdate({isValid, isInvalid: !isValid});
  }

  handleFormStatusUpdate(status) {
    /** the status is sent from all kinds of inputs from targets folder **/
    for (const statusKey in status) {
      this[statusKey] = status[statusKey];
    }
    this.notifyFormViewUpdate(status);
  }

  /** set events for form status update **/
  setEvents() {
    /** for form fields to notify the current form about valid status **/
    /** then the form sends an event to update the frontend view **/
    EventManager.subscribe({
      formId: this.id,
      eventName: `${EVENT_FORM_VALID_UPDATE}-${this.id}`,
      handler: this.handleFormValidStatus.bind(this)
    });
    /** for form fields to notify the current form about other statuses like isTouched or isPristine **/
    /** then the form sends an event to update the frontend view **/
    EventManager.subscribe({
      formId: this.id,
      eventName: `${EVENT_FORM_STATUS_UPDATE}-${this.id}`,
      handler: this.handleFormStatusUpdate.bind(this)
    });
  }

  /** set event target **/
  setFormEventTarget(target) {
    if (target) {
      this.form = new Form({id: IdGenerator.getId(), formId: this.id, target});
    }
  }

  setFieldEventTarget(fieldId, targetList) {
    if (targetList.length > 0) {
      this.fields[fieldId].setEventTarget(targetList);
    } else {
      this.fields[fieldId].setCustomField();
    }
  }

  /** update rules **/
  updateFieldRules(formId, fieldId, rules, isCrossField) {
    const field = this.fields[fieldId];
    if (field.removeEvents) {
      field.removeEvents();
    }
    this.fields[fieldId] = FieldCreator.createField({
      id: fieldId,
      formId,
      fieldName: field.fieldName,
      rules,
      isCrossField,
      delay: field.delay,
      errorMode: field.errorMode,
      mode: field.mode,
      formData: this.formData,
      setFormData: this.setFormData.bind(this)
    });
  }

  /** remove **/
  removeField(fieldId) {
    const field = this.fields[fieldId];
    if (field.removeEvents) {
      field.removeEvents();
    }
    delete this.formData[field.fieldName];
    delete this.fields[fieldId];
  }

  /** reset fields **/
  resetForm() {
    for (const fieldId in this.fields) {
      const field = this.fields[fieldId];
      field.resetField();
    }
  }

  updateFieldErrorMessages() {
    for (const fieldId in this.fields) {
      const field = this.fields[fieldId];
      field.updateErrorMessages();
    }
  }
}
