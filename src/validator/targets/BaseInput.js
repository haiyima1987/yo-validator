export default class BaseInput {
  constructor({id, formId, fieldId, targetList, updateFieldStatus}) {
    this.id = id;
    this.formId = formId;
    this.fieldId = fieldId;
    this.targetList = targetList;
    this.updateFieldStatus = updateFieldStatus;
    this.validateTimeout = undefined;
  }
}
