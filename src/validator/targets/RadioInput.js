import {EVENT_CHANGE, DELAY_VALIDATION} from "../constants";
import BaseInput from "./BaseInput";

export default class RadioInput extends BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.setEventHandler();
  }

  getFieldData() {
    const result = this.targetList.find(input => input.checked);
    return result ? result.value : '';
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
      input.removeEventListener(EVENT_CHANGE, this.handleChange.bind(this), true);
    }
  }

  updateStatus() {
    this.updateFieldStatus({
      isTouched: true,
      isDirty: true
    });
  }
}
