import defaultMessageLangs from "../messages";
import {DEFAULT_LANG, FIELD_NAME_PLACEHOLDER, KEY_NAME_LOCALE} from "../constants";
import RuleRequired from "./default/RuleRequired";
import RuleEmail from "./default/RuleEmail";
import RuleMaxSize from "./default/RuleMaxSize";
import RuleMaxLength from "./default/RuleMaxLength";
import RuleMax from "./default/RuleMax";
import RuleMin from "./default/RuleMin";
import RuleSame from "./default/RuleSame";
import RuleDiff from "./default/RuleDiff";
import RuleExtension from "./default/RuleExtension";
import RuleMinSize from "./default/RuleMinSize";
import RuleMinLength from "./default/RuleMinLength";
import RuleAlpha from "./default/RuleAlpha";
import RuleAlphaNumeric from "./default/RuleAlphaNumeric";
import RuleNumeric from "./default/RuleNumeric";
import CustomRule from "../rules/CustomRule";
import CustomRuleCrossField from "../rules/CustomRuleCrossField";

class ValidationRules {
  constructor() {
    this.selectedLanguage = DEFAULT_LANG;
    this.selectedMessages = defaultMessageLangs[DEFAULT_LANG];
    this.defaultMessages = defaultMessageLangs[DEFAULT_LANG];
    this.ruleList = {
      required: new RuleRequired(),
      alpha: new RuleAlpha(),
      alphaNumeric: new RuleAlphaNumeric(),
      numeric: new RuleNumeric(),
      email: new RuleEmail(),
      maxSize: new RuleMaxSize(),
      minSize: new RuleMinSize(),
      ext: new RuleExtension(),
      maxLength: new RuleMaxLength(),
      minLength: new RuleMinLength(),
      max: new RuleMax(),
      min: new RuleMin(),
      same: new RuleSame(),
      diff: new RuleDiff()
    };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ValidationRules();
    }
    return this.instance;
  }

  setRule(name, validator, {isCrossField}) {
    if (isCrossField) {
      this.ruleList[name] = new CustomRuleCrossField(validator);
    } else {
      this.ruleList[name] = new CustomRule(validator);
    }
  }

  setMessages(messages) {
    for (const keyName in messages) {
      if (keyName !== KEY_NAME_LOCALE) {
        defaultMessageLangs[keyName] = defaultMessageLangs[keyName] || {names: {}, messages: {}};
        const langMessages = messages[keyName];
        defaultMessageLangs[keyName].names = Object.assign({}, defaultMessageLangs[keyName].names, langMessages.names);
        defaultMessageLangs[keyName].messages = Object.assign({}, defaultMessageLangs[keyName].messages, langMessages.messages);
      }
    }
    this.setSelectedLanguage(messages.locale);
  }

  setSelectedLanguage(lang) {
    if (lang && defaultMessageLangs[lang]) {
      this.selectedLanguage = lang;
      this.selectedMessages = defaultMessageLangs[lang];
    } else {
      this.selectedLanguage = Object.keys(defaultMessageLangs)[0];
      this.selectedMessages = defaultMessageLangs[this.selectedLanguage];
    }
  }

  getErrorMessage(fieldName, ruleName, args) {
    /** check if messages and rule name are defined **/
    if (!this.selectedMessages.messages[ruleName]) {
      console.info(`Messages or rule name isn't defined, switched to default/general error`);
      return !this.defaultMessages.messages[ruleName]
        ? this.defaultMessages.messages.default
        : this.parseMessage(this.defaultMessages.messages[ruleName].default, fieldName, ruleName, args);
    }
    /** get error user defined: required.username > required.default > default: default.required **/
    let error = this.selectedMessages.messages[ruleName][fieldName]
      || this.selectedMessages.messages[ruleName].default
      || this.defaultMessages.messages.default;
    return this.parseMessage(error, fieldName, ruleName, args);
  }

  parseMessage(message, fieldName, ruleName, args) {
    // get defined username or just use the key name to replace
    fieldName = this.selectedMessages.names && this.selectedMessages.names[fieldName] ? this.selectedMessages.names[fieldName] : fieldName;
    // replace {fieldName}, for instance {fieldName} -> username
    message = message.replace(FIELD_NAME_PLACEHOLDER, fieldName);
    // replace {max} by 8 for instance, if needed
    const ruleValidator = this.ruleList[ruleName];
    // parse message according to different rules
    message = ruleValidator.parseMessage(message, ruleName, args);
    return message;
  }

  getGroupErrorMessage(fieldName, ruleName, args) {
    const nameText = fieldName.split('-')[0];
    const nameKey = `${nameText}-*`;
    /** check if messages and rule name are defined **/
    if (!this.selectedMessages.messages[ruleName]) {
      console.info(`Messages or rule name isn't defined, switched to default/general error`);
      return !this.defaultMessages.messages[ruleName]
        ? this.defaultMessages.messages.default
        : this.parseGroupErrorMessage(this.defaultMessages.messages[ruleName].default, fieldName, nameKey, ruleName, args);
    }
    /** get error user defined: required.username > required.default > default: default.required **/
    let error = this.selectedMessages.messages[ruleName][nameKey]
      || this.selectedMessages.messages[ruleName].default
      || this.defaultMessages.messages.default;
    return this.parseGroupErrorMessage(error, fieldName, nameKey, ruleName, args);
  }

  parseGroupErrorMessage(message, fieldName, nameKey, ruleName, args) {
    // get defined username or just use the key name to replace
    const nameHandler = this.selectedMessages.names && this.selectedMessages.names[nameKey] ? this.selectedMessages.names[nameKey] : fieldName;
    // replace fieldName
    message = this.replaceFieldName(nameHandler, fieldName, message);
    // replace {max} by 8 for instance, if needed
    const ruleValidator = this.ruleList[ruleName];
    // parse message according to different rules
    message = ruleValidator.parseMessage(message, ruleName, args);
    return message;
  }

  replaceFieldName(nameHandler, fieldName, message) {
    if (typeof nameHandler === 'string') {
      // here deal with this case: 'description-*': 'description'
      message = message.replace(FIELD_NAME_PLACEHOLDER, nameHandler);
    } else {
      // use the user defined function to format the name
      const parsedName = nameHandler(fieldName);
      message = message.replace(FIELD_NAME_PLACEHOLDER, parsedName);
    }
    return message;
  }

  getValidator(ruleName) {
    return this.ruleList[ruleName];
  }
}

export default ValidationRules.getInstance();
