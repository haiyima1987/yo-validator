import CheckInput from "./CheckInput";
import {EVENT_CHANGE} from "../constants";

export default class ActiveCheckInput extends CheckInput {
  constructor({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules}) {
    super({id, formId, fieldId, targetList, updateFieldStatus})
    this.validateRules = validateRules;
    this.delay = delay;
  }

  handleChange() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.updateEventHandler();
      this.updateStatus();
      this.validateRules();
    }, this.delay);
  }

  updateEventHandler() {
    this.removeEventHandler();
    this.evenHandler = this.handleChangeValidate.bind(this);
    for (const keyName in this.targetList) {
      const input = this.targetList[keyName];
      input.addEventListener(EVENT_CHANGE, this.evenHandler, true);
    }
  }

  handleChangeValidate() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.validateRules();
    }, this.delay);
  }
}
