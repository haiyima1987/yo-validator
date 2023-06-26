import FieldCreator from "./fields/FieldCreator";

class FieldManager {
  constructor() {
    this.fields = {};
    this.fieldData = {};
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FieldManager();
    }
    return this.instance;
  }

  setFieldData({fieldName, data}) {
    /** update the fieldData to keep a reference for all fields in this manager **/
    this.fieldData[fieldName] = data;
  }

  setDataByFieldId(fieldId, data) {
    this.fields[fieldId].setData(data);
  }

  addFormField({fieldId, fieldName, rules, isCrossField, delay, mode, errorMode}) {
    this.fields[fieldId] = FieldCreator.createField({
      id: fieldId,
      fieldName,
      rules,
      isCrossField,
      delay,
      errorMode,
      mode,
      formData: this.fieldData,
      setFormData: this.setFieldData.bind(this)
    })
    return {field: this.fields[fieldId]};
  }

  validateFieldById(fieldId) {
    return this.fields[fieldId].validateRules();
  }

  validateFieldByData(fieldId, data) {
    const field = this.fields[fieldId];
    const parsedData = {[field.fieldName]: data};
    return this.fields[fieldId].validateRulesByData(parsedData);
  }

  /** set event target **/
  setFieldEventTarget(fieldId, targetList) {
    if (targetList.length > 0) {
      this.fields[fieldId].setEventTarget(targetList);
    } else {
      this.fields[fieldId].setCustomField();
    }
  }

  /** update rules **/
  updateFieldRules(fieldId, rules) {
    this.fields[fieldId].updateRules(rules);
  }

  /** remove **/
  removeField(fieldId) {
    delete this.fieldData[this.fields[fieldId].fieldName];
    delete this.fields[fieldId];
  }
}

export default FieldManager.getInstance();
