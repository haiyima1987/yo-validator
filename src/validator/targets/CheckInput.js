import {EVENT_CHANGE, DELAY_VALIDATION} from "../constants";
import BaseInput from "./BaseInput";

export default class CheckInput extends BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.setEventHandler();
  }

  getFieldData() {
    let result = [];
    for (const keyName in this.targetList) {
      const input = this.targetList[keyName];
      if (input.checked) {
        result = result.concat(input.value);
      }
    }
    return result;
  }

  setEventHandler() {
    this.evenHandler = this.handleChange.bind(this);
    for (const keyName in this.targetList) {
      const input = this.targetList[keyName];
      input.addEventListener(EVENT_CHANGE, this.evenHandler, true);
    }
  }

  handleChange() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.updateStatus();
      this.removeEventHandler();
    }, DELAY_VALIDATION);
  }

  removeEventHandler() {
    for (const keyName in this.targetList) {
      const input = this.targetList[keyName];
      input.removeEventListener(EVENT_CHANGE, this.evenHandler, true);
    }
  }

  updateStatus() {
    this.updateFieldStatus({
      isTouched: true,
      isDirty: true
    });
  }
}
