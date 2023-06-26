import {INPUT_TYPES, MODES} from "../constants";
import IdGenerator from "../IdGenerator";
import CheckInput from "../targets/CheckInput";
import RadioInput from "../targets/RadioInput";
import FileInput from "../targets/FileInput";
import SelectInput from "../targets/SelectInput";
import TextInput from "../targets/TextInput";
import ActiveCheckInput from "../targets/ActiveCheckInput";
import ActiveRadioInput from "../targets/ActiveRadioInput";
import ActiveFileInput from "../targets/ActiveFileInput";
import ActiveSelectInput from "../targets/ActiveSelectInput";
import ActiveTextInput from "../targets/ActiveTextInput";
import LazyTextInput from "../targets/LazyTextInput";

class InputCreator {
  static getInstance() {
    if (!this.instance) {
      this.instance = new InputCreator();
    }
    return this.instance;
  }

  createInput({formId, fieldId, mode, type, delay, targetList, updateFieldStatus, validateRules}) {
    let input;
    const id = IdGenerator.getId();
    if (mode === MODES.ACTIVE) {
      input = this.createActiveInput({id, formId, fieldId, type, delay, targetList, updateFieldStatus, validateRules})
    } else if (mode === MODES.LAZY) {
      input = this.createLazyInput({id, formId, fieldId, type, delay, targetList, updateFieldStatus, validateRules});
    } else {
      input = this.createBaseInput({id, formId, fieldId, type, targetList, updateFieldStatus});
    }
    return input;
  }

  createBaseInput({id, formId, fieldId, type, targetList, updateFieldStatus}) {
    let input;
    if (type === INPUT_TYPES.CHECKBOX) {
      input = new CheckInput({id, formId, fieldId, targetList, updateFieldStatus});
    } else if (type === INPUT_TYPES.RADIO) {
      input = new RadioInput({id, formId, fieldId, targetList, updateFieldStatus});
    } else if (type === INPUT_TYPES.FILE) {
      input = new FileInput({id, formId, fieldId, targetList, updateFieldStatus});
    } else if (type === INPUT_TYPES.SELECT) {
      input = new SelectInput({id, formId, fieldId, targetList, updateFieldStatus});
    } else {
      input = new TextInput({id, formId, fieldId, targetList, updateFieldStatus});
    }
    return input;
  }

  createActiveInput({id, formId, fieldId, type, delay, targetList, updateFieldStatus, validateRules}) {
    let input;
    if (type === INPUT_TYPES.CHECKBOX) {
      input = new ActiveCheckInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else if (type === INPUT_TYPES.RADIO) {
      input = new ActiveRadioInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules})
    } else if (type === INPUT_TYPES.FILE) {
      input = new ActiveFileInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else if (type === INPUT_TYPES.SELECT) {
      input = new ActiveSelectInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else {
      input = new ActiveTextInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    }
    return input;
  }

  createLazyInput({id, formId, fieldId, type, delay, targetList, updateFieldStatus, validateRules}) {
    let input;
    if (type === INPUT_TYPES.CHECKBOX) {
      input = new ActiveCheckInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else if (type === INPUT_TYPES.RADIO) {
      input = new ActiveRadioInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else if (type === INPUT_TYPES.FILE) {
      input = new ActiveFileInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else if (type === INPUT_TYPES.SELECT) {
      input = new ActiveSelectInput({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules});
    } else {
      input = new LazyTextInput({id, formId, fieldId, targetList, updateFieldStatus, validateRules});
    }
    return input;
  }
}

export default InputCreator.getInstance();
