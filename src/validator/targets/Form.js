import {EVENT_SUBMIT, PROP_NOVALIDATE} from "../constants";

export default class Form {
  constructor({id, formId, target}) {
    this.id = id;
    this.formId = formId;
    this.target = target;
    this.setEventHandler();
    this.validateTimeout = undefined;
  }

  setEventHandler() {
    this.target.setAttribute(PROP_NOVALIDATE, true);
    this.target.addEventListener(EVENT_SUBMIT, this.handleSubmit.bind(this), true);
  }

  handleSubmit(e) {
    e.preventDefault();
  }
}
