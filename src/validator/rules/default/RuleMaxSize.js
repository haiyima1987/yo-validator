import BaseRule from "../BaseRule";

export default class RuleMaxSize extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, maxSize) {
    /** if length isn't provided, then don't validate, return true, let the user know "it doesn't work" **/
    if (!maxSize) return true;
    const maxSizeLimit = parseFloat(maxSize) * 1024;
    const fieldData = formData[fieldName];
    const fileList = fieldData instanceof FileList ? Array.from(fieldData) : fieldData;
    if (Array.isArray(fileList)) {
      // check if any item is bigger than allowed size
      return !fileList.some(file => {
        return this.checkFileSize(file, maxSizeLimit);
      });
    }
    return !this.checkFileSize(fieldData, maxSizeLimit);
  }

  checkFileSize(file, maxSizeLimit) {
    return file.size > maxSizeLimit;
  }

  parseMessage(message, ruleName, args) {
    return super.parseStandardMessage(message, ruleName, args);
  }
}
