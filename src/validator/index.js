import ValidationRules from './rules/ValidationRules';
import IdGenerator from "./IdGenerator";
import FormManager from "./FormManager";
import FieldManager from "./FieldManager";
import {
  DELAY_VALIDATION,
  ERROR_MODES,
  EVENT_FIELD_VIEW_UPDATE,
  EVENT_FORM_VIEW_UPDATE,
  EVENT_INVALID_FIELD,
  MODES
} from "./constants";
import EventManager from "./EventManager";

class YoValidator {
  constructor() {
    this.currentFormId = undefined;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoValidator();
    }
    return this.instance;
  }

  setRule(name, validator, options = {}) {
    ValidationRules.setRule(name, validator, options);
  }

  setMessages(messages) {
    ValidationRules.setMessages(messages);
    this.resetErrorMessages();
  }

  setLanguage(lang) {
    ValidationRules.setSelectedLanguage(lang);
    this.resetErrorMessages();
  }

  registerForm({mode, name, errorMode, valid, setErrors, setStatus}) {
    // indicate a form is being created
    this.currentFormId = undefined;
    // check mode
    if (typeof mode !== 'number' || ![MODES.SUBMIT, MODES.LAZY, MODES.ACTIVE].includes(mode)) {
      console.error('Please pass in valid mode');
      return false;
    }
    valid = this.checkValid(valid);
    mode = this.checkMode(mode);
    errorMode = this.checkErrorMode(errorMode);
    // get unique id
    const formId = IdGenerator.getId();
    // register form for cross fields
    EventManager.setForm(formId);
    // define callback for pub-sub
    const errorHandler = (messages) => {
      setErrors(messages);
    };
    EventManager.subscribe({formId, eventName: `${EVENT_INVALID_FIELD}-${formId}`, handler: errorHandler});
    // define callback for pub-sub
    const statusHandler = (data) => {
      setStatus(data);
    };
    EventManager.subscribe({formId, eventName: `${EVENT_FORM_VIEW_UPDATE}-${formId}`, handler: statusHandler});
    // get form according to mode
    const form = FormManager.addFormByMode({formId, mode, name, errorMode, valid});
    // set currentFormId to indicate the form is created successfully
    this.currentFormId = formId;
    // define handle submit validation method
    const handleSubmit = (callback) => {
      const {isFormValid, formData} = FormManager.validateFormFields(formId);
      // submit with the callback
      if (isFormValid) {
        callback(formData);
      }
    }
    const setEventTarget = (target) => {
      FormManager.setFormEventTarget(formId, target);
    }
    // define all fields validation function for flexibility
    const validateFormFields = () => {
      return FormManager.validateFormFields(formId);
    }
    const removeForm = () => {
      FormManager.removeForm(formId);
      EventManager.removeForm(formId);
    }
    return {
      formId,
      form,
      setEventTarget,
      handleSubmit,
      validateFormFields,
      removeForm
    };
  }

  registerField({fieldName, rules, isCrossField, delay, mode, errorMode, setErrors}) {
    if (!this.currentFormId) {
      console.error('Form is not created yet');
      return false;
    }
    if (!fieldName || rules === null || rules === undefined) {
      console.error('Please pass in fieldName and rules');
      return false;
    }
    delay = this.checkDelay(delay);
    mode = this.checkMode(mode);
    errorMode = this.checkErrorMode(errorMode);
    const fieldId = IdGenerator.getId();
    // generate unique id
    const {formId, field} = FormManager.addFormField({
      fieldId,
      fieldName,
      rules,
      isCrossField,
      delay,
      mode,
      errorMode
    });
    // define callback for pub-sub
    const errorHandler = (messages) => {
      setErrors(messages);
    };
    EventManager.subscribe({formId, eventName: `${EVENT_INVALID_FIELD}-${fieldId}`, handler: errorHandler});
    /** you can also get the function to validate single field if you already set field data on input change **/
    const validateField = () => {
      return FormManager.validateFieldById(formId, fieldId);
    }
    /** you can also get the function to validate single field by passing data in **/
    const validateFieldByData = (data) => {
      return FormManager.validateFieldByData(formId, fieldId, data);
    }
    const setData = (data) => {
      return FormManager.setDataByFieldId(formId, fieldId, data);
    }
    const setEventTarget = (targetList) => {
      return FormManager.setFieldEventTarget(formId, fieldId, targetList);
    }
    const updateField = (rules, isCrossField) => {
      return FormManager.updateFieldRules(formId, fieldId, rules, isCrossField);
    }
    const removeField = () => {
      EventManager.unsubscribe({formId, eventName: `${EVENT_INVALID_FIELD}-${fieldId}`});
      FormManager.removeFormField(formId, fieldId);
    }
    // add it to the corresponding form fields
    return {
      formId,
      mode: field.mode,
      fieldId,
      validateField,
      validateFieldByData,
      setData,
      setEventTarget,
      updateField,
      removeField
    };
  }

  registerSingleField({fieldName, rules, isCrossField, delay, mode, errorMode, setErrors, setStatus}) {
    if (!fieldName || rules === null || rules === undefined) {
      console.error('Please pass in fieldName and rules');
      return false;
    }
    delay = this.checkDelay(delay);
    mode = this.checkMode(mode);
    errorMode = this.checkErrorMode(errorMode);
    const fieldId = IdGenerator.getId();
    // define callback for pub-sub
    const errorHandler = (messages) => {
      setErrors(messages);
    };
    EventManager.subscribe({eventName: `${EVENT_INVALID_FIELD}-${fieldId}`, handler: errorHandler});
    // define callback for pub-sub
    const statusHandler = (data) => {
      setStatus(data);
    };
    EventManager.subscribe({eventName: `${EVENT_FIELD_VIEW_UPDATE}-${fieldId}`, handler: statusHandler});
    // generate unique id
    const {field} = FieldManager.addFormField({
      fieldId,
      fieldName,
      rules,
      isCrossField,
      delay,
      mode,
      errorMode
    });
    /** you can also get the function to validate single field if you already set field data on input change **/
    const validateField = () => {
      return FieldManager.validateFieldById(fieldId);
    }
    /** you can also get the function to validate single field by passing data in **/
    const validateFieldByData = (data) => {
      return FieldManager.validateFieldByData(fieldId, data);
    }
    const setData = (data) => {
      return FieldManager.setDataByFieldId(fieldId, data);
    }
    const setEventTarget = (targetList) => {
      return FieldManager.setFieldEventTarget(fieldId, targetList);
    }
    const updateRules = (rules) => {
      return FieldManager.updateFieldRules(fieldId, rules);
    }
    const removeField = () => {
      FieldManager.removeField(fieldId);
      EventManager.removeField(fieldId, fieldName);
    }
    // add it to the corresponding form fields
    return {
      fieldId,
      field,
      validateField,
      validateFieldByData,
      setData,
      setEventTarget,
      updateRules,
      removeField
    };
  }

  checkErrorMode(errorMode) {
    errorMode = Number(errorMode);
    return errorMode && !Object.values(ERROR_MODES).includes(errorMode) ? ERROR_MODES.ALL : errorMode;
  }

  checkMode(mode) {
    mode = Number(mode);
    return mode && !Object.values(MODES).includes(mode) ? MODES.SUBMIT : mode;
  }

  checkDelay(delay) {
    delay = Number(delay);
    return !isNaN(delay) && delay > 0 ? delay : DELAY_VALIDATION;
  }

  checkValid(valid) {
    return typeof valid === "boolean" ? valid : true;
  }

  resetForm() {
    FormManager.reset();
  }

  resetFormByName(name) {
    FormManager.resetByName(name);
  }

  resetErrorMessages() {
    FormManager.updateFormErrorMessages();
  }
}

export default YoValidator.getInstance();
