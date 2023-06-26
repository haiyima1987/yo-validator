import SubmitForm from "./forms/SubmitForm";
import LazyForm from "./forms/LazyForm";
import ActiveForm from "./forms/ActiveForm";
import {MODES} from "./constants";

class FormManager {
  constructor() {
    this.forms = {};
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FormManager();
    }
    return this.instance;
  }

  /** validate **/
  validateFormFields(formId) {
    // it must exist since there is no human intervention
    return this.forms[formId].validateFormFields();
  }

  validateFieldByData(formId, fieldId, data) {
    this.forms[formId].validateFieldByData(fieldId, data);
  }

  validateFieldById(formId, fieldId) {
    this.forms[formId].validateField(fieldId);
  }

  /** add form field rules **/
  addFormField({fieldId, fieldName, rules, isCrossField, delay, mode, errorMode}) {
    // rendering order: FormWrapper first, then all fields inside, so always the last element
    const keyList = Object.keys(this.forms);
    if (keyList.length > 0) {
      // last element is the current form
      const currentForm = this.forms[keyList[keyList.length - 1]];
      const {field} = currentForm.addFormField({
        fieldId,
        formId: currentForm.id,
        fieldName,
        rules,
        isCrossField,
        delay,
        mode,
        errorMode
      });
      return {formId: currentForm.id, field};
    }
  }

  /** set field data (for a field without input tags, then data need to be set manually) **/
  setDataByFieldId(formId, fieldId, data) {
    return this.forms[formId].setFieldDataByFieldId(fieldId, data);
  }

  /** set event targets **/
  setFormEventTarget(formId, target) {
    this.forms[formId].setFormEventTarget(target);
  }

  setFieldEventTarget(formId, fieldId, targetList) {
    this.forms[formId].setFieldEventTarget(fieldId, targetList);
  }

  /** form mode **/
  addFormByMode({formId, mode, name, errorMode, valid}) {
    let form;
    if (mode === MODES.ACTIVE) {
      form = new ActiveForm(formId, name, errorMode, valid);
    } else if (mode === MODES.LAZY) {
      form = new LazyForm(formId, name, errorMode, valid);
    } else {
      form = new SubmitForm(formId, name, errorMode, valid);
    }
    // assign a new form
    this.forms[formId] = form;
    return form;
  }

  getFormModeByFormId(formId) {
    return this.forms[formId].mode;
  }

  getFormByName(name) {
    for (const formId in this.forms) {
      const form = this.forms[formId];
      if (form.name === name) {
        return form;
      }
    }
    return false;
  }

  /** update rules **/
  updateFieldRules(formId, fieldId, rules, isCrossField) {
    return this.forms[formId].updateFieldRules(formId, fieldId, rules, isCrossField);
  }

  /** remove **/
  removeForm(formId) {
    delete this.forms[formId];
  }

  removeFormField(formId, fieldId) {
    if (this.forms[formId]) {
      return this.forms[formId].removeField(fieldId);
    }
  }

  /** reset **/
  reset() {
    const keys = Object.keys(this.forms);
    if (keys.length > 0) {
      this.forms[keys[0]].resetForm();
    }
  }

  resetByName(name) {
    const form = this.getFormByName(name);
    if (form) {
      form.resetForm();
    }
  }

  updateFormErrorMessages() {
    for (const formId in this.forms) {
      const form = this.forms[formId];
      form.updateFieldErrorMessages();
    }
  }
}

export default FormManager.getInstance();
