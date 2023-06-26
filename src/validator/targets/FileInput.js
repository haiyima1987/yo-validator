import {EVENT_CHANGE, DELAY_VALIDATION} from "../constants";
import BaseInput from "./BaseInput";

export default class FileInput extends BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    super({id, formId, fieldId, targetList, updateFieldStatus});
    this.target = this.targetList[0];
    this.setEventHandler();
  }

  getFieldData() {
    return this.target.files;
  }

  setEventHandler() {
    this.evenHandler = this.handleFile.bind(this);
    this.target.addEventListener(EVENT_CHANGE, this.evenHandler, true);
  }

  handleFile() {
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
