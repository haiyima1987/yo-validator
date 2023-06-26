// form modes
export const MODES = Object.freeze({
  SUBMIT: 1,
  LAZY: 2,
  ACTIVE: 3
});
// error modes
export const ERROR_MODES = Object.freeze({
  ALL: 1,
  ONE: 2
});
// types
export const INPUT_TYPES = Object.freeze({
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
  SELECT: 'select'
});
export const TYPE_EMAIL = 'email';
// pub-sub events
export const EVENT_INVALID_FIELD = 'INVALID_FIELD';
export const EVENT_FORM_STATUS_UPDATE = 'FORM_STATUS_UPDATE';
export const EVENT_FORM_VIEW_UPDATE = 'FORM_VIEW_UPDATE';
export const EVENT_FORM_VALID_UPDATE = 'FORM_VALID_UPDATE';
export const EVENT_FIELD_VIEW_UPDATE = 'FIELD_STATUS_UPDATE';
export const EVENT_CROSS_FIELD_ADD = 'CROSS_FIELD_ADD';
export const EVENT_CROSS_FIELD_REMOVE = 'CROSS_FIELD_REMOVE';
export const EVENT_PAIR_FIELD_SET_DATA = 'PAIR_FIELD_SET_DATA';
// input events and props
export const EVENT_BLUR = 'blur';
export const EVENT_INPUT = 'input';
export const EVENT_CHANGE = 'change';
export const EVENT_SUBMIT = 'submit';
export const PROP_NOVALIDATE = 'novalidate';
export const DELAY_VALIDATION = 10;
// rules
export const RULE_REQUIRED = 'required';
// cross field confirmation
export const INDICATOR_CROSS_FIELD = '@';
// validation
export const DEFAULT_LANG = 'en';
export const FIELD_NAME_PLACEHOLDER = '{fieldName}';
export const KEY_NAME_LOCALE = 'locale';
