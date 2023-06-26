import BaseRule from "../BaseRule";

export default class RuleExtension extends BaseRule {
  constructor() {
    super();
  }

  validate(fieldName, formData, extensions) {
    /** if extensions isn't provided, then don't validate, return true, let the user know "it doesn't work" **/
    if (!extensions) return true;
    const extensionList = extensions.split(',').map(extension => extension.toLowerCase());
    const fieldData = formData[fieldName];
    const fileList = fieldData instanceof FileList ? Array.from(fieldData) : fieldData;
    if (Array.isArray(fileList)) {
      // check if any item that is not of any allowed extension
      return !fileList.some(file => {
        return this.checkExtension(file, extensionList);
      });
    }
    return !this.checkExtension(fieldData, extensionList);
  }

  checkExtension(file, extensionList) {
    const fileExtension = file.name.split('.')[1];
    return fileExtension ? !extensionList.includes(fileExtension.toLowerCase()) : false;
  }

  parseMessage(message, ruleName, args) {
    args = args.split(',').join(', ');
    return this.parseStandardMessage(message, ruleName, args);
  }
}
