import BaseRule from "../BaseRule";

export default class RuleMinSize extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, minSize) {
    /** if length isn't provided, then don't validate, return true, let the user know "it doesn't work" **/
    if (!minSize) return true;
    const minSizeLimit = parseFloat(minSize) * 1024;
    const fieldData = formData[fieldName];
    const fileList = fieldData instanceof FileList ? Array.from(fieldData) : fieldData;
    if (Array.isArray(fileList)) {
      // check if any item is smaller than minimum required size
      return !fileList.some(file => {
        return this.checkFileSize(file, minSizeLimit);
      });
    }
    return !this.checkFileSize(fieldData, minSizeLimit);
  }

  checkFileSize(file, minSizeLimit) {
    return file.size < minSizeLimit;
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args)
  }
}
