import FileInput from "./FileInput";
import {EVENT_CHANGE} from "../constants";

export default class ActiveFileInput extends FileInput {
  constructor({id, formId, fieldId, targetList, delay, updateFieldStatus, validateRules}) {
    super({id, formId, fieldId, targetList, updateFieldStatus})
    this.validateRules = validateRules;
    this.delay = delay;
  }

  handleFile() {
    this.validateTimeout = setTimeout(() => {
      this.updateEventHandler();
      this.updateStatus();
      this.validateRules();
    }, this.delay);
  }

  updateEventHandler() {
    this.removeEventHandler();
    this.evenHandler = this.handleFileValidate.bind(this);
    this.target.addEventListener(EVENT_CHANGE, this.evenHandler, true);
  }

  handleFileValidate() {
    this.validateTimeout = setTimeout(() => {
      this.validateRules();
    }, this.delay);
  }
}
