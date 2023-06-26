import BaseForm from "./BaseForm";
import {MODES} from "../constants";

export default class ActiveForm extends BaseForm {
  constructor(formId, name, errorMode, valid) {
    super(formId, name, errorMode, valid);
    this.isValid = valid !== undefined && valid !== null ? valid : false;
    this.isInvalid = !this.isValid;
    this.mode = MODES.ACTIVE;
  }
}
