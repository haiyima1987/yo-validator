import {DELAY_VALIDATION, EVENT_BLUR, EVENT_INPUT} from "../constants";
import TextInput from "./TextInput";

export default class LazyTextInput extends TextInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus, validateRules}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.validateRules = validateRules;
    this.setEventHandler();
  }

  handleInput(e) {
    if (e.target.value.length > 0) {
      this.updateFieldStatus({
        isDirty: true
      });
      this.target.removeEventListener(EVENT_INPUT, this.inputHandler, true);
    }
  }

  handleBlur(e) {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.updateBlurHandler();
      this.updateFieldStatus({
        isTouched: true
      });
      this.validateRules();
    }, DELAY_VALIDATION);
  }

  updateBlurHandler() {
    this.removeBlurHandler();
    this.blurHandler = this.handleBlurValidate.bind(this);
    this.target.addEventListener(EVENT_BLUR, this.blurHandler, true);
  }

  handleBlurValidate() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.validateRules();
    }, DELAY_VALIDATION);
  }
}
