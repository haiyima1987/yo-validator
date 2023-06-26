import BaseInput from "./BaseInput";
import {DELAY_VALIDATION, EVENT_BLUR, EVENT_INPUT} from "../constants";

export default class TextInput extends BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.target = this.targetList[0];
    this.setEventHandler();
  }

  getFieldData() {
    return this.target.value;
  }

  setEventHandler() {
    this.inputHandler = this.handleInput.bind(this);
    this.blurHandler = this.handleBlur.bind(this);
    this.target.addEventListener(EVENT_INPUT, this.inputHandler, true);
    this.target.addEventListener(EVENT_BLUR, this.blurHandler, true);
  }

  handleInput(e) {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      if (e.target.value.length > 0) {
        this.updateFieldStatus({
          isDirty: true
        });
        this.removeInputHandler();
      }
    }, DELAY_VALIDATION);
  }

  removeInputHandler() {
    this.target.removeEventListener(EVENT_INPUT, this.inputHandler, true);
  }

  handleBlur() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.updateFieldStatus({
        isTouched: true
      });
      this.removeBlurHandler();
    }, DELAY_VALIDATION);
  }

  removeBlurHandler() {
    this.target.removeEventListener(EVENT_BLUR, this.blurHandler, true);
  }
}
