import {EVENT_CHANGE, DELAY_VALIDATION} from "../constants";
import BaseInput from "./BaseInput";

export default class SelectInput extends BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.target = this.targetList[0];
    this.setEventHandler();
  }

  getFieldData() {
    const options = Array.from(this.target.options);
    const result = options.find(option => option.selected && option.value);
    return result ? result.value : '';
  }

  getFieldDataMultiple() {
    let result = [];
    const options = Array.from(this.target.options);
    for (const keyName in options) {
      const option = options[keyName];
      if (option.selected && option.value) {
        result = result.concat(option.value);
      }
    }
    return result;
  }

  setEventHandler() {
    this.getFieldData = this.target.multiple ? this.getFieldDataMultiple : this.getFieldData;
    this.evenHandler = this.handleChange.bind(this);
    this.target.addEventListener(EVENT_CHANGE, this.evenHandler, true);
  }

  handleChange() {
    clearTimeout(this.validateTimeout);
    this.validateTimeout = setTimeout(() => {
      this.updateStatus();
      this.removeEventHandler();
    }, DELAY_VALIDATION);
  }

  removeEventHandler() {
    this.target.removeEventListener(EVENT_CHANGE, this.evenHandler, true);
  }

  updateStatus() {
    this.updateFieldStatus({
      isTouched: true,
      isDirty: true
    });
  }
}
