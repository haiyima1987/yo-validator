import BaseForm from "./BaseForm";
import {MODES} from "../constants";

export default class LazyForm extends BaseForm {
  constructor(formId, name, errorMode, valid) {
    super(formId, name, errorMode, valid);
    this.mode = MODES.LAZY;
  }
}
