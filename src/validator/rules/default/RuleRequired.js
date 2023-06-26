import BaseRule from "../BaseRule";

export default class RuleRequired extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData) {
    const fieldData = formData[fieldName];
    if (fieldData instanceof FileList) {
      return Array.from(fieldData).length > 0;
    } else if (typeof fieldData === "string") {
      return !!fieldData.trim();
    }
    return !!fieldData;
  }
}
