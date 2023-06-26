export default class BaseRule {
  constructor() {
  }

  validateByRegex(fieldName, formData, regex) {
    const fieldData = formData[fieldName];
    return regex.test(fieldData);
  }

  /** here fieldName is already replaced, suitable for plain text error without replacing args like minLength etc. **/
  parseMessage(message, ruleName, args) {
    return message;
  }

  parseStandardMessage(message, ruleName, args) {
    if (!ruleName || !args) return message;
    return message.replace(`{${ruleName}}`, args)
  }
}
