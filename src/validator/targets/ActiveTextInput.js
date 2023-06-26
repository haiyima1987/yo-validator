import {EVENT_INPUT} from "../constants";
import TextInput from "./TextInput";

export default class ActiveTextInput extends TextInput {
  constructor({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.validateRules = validateRules;
    this.delay = delay;
  }

  handleInput(e) {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      if (e.target.value.length > 0) {
        this.updateInputHandler();
        this.updateFieldStatus({
          isDirty: true
        });
        this.validateRules();
      }
    }, this.delay);
  }

  updateInputHandler() {
    this.removeInputHandler();
    this.inputHandler = this.handleInputValidate.bind(this);
    this.target.addEventListener(EVENT_INPUT, this.inputHandler, true);
  }

  handleInputValidate() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.validateRules();
    }, this.delay);
  }
}
