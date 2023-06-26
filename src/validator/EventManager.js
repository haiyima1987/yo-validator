import {EVENT_FIELD_VIEW_UPDATE, EVENT_INVALID_FIELD} from "./constants";

class EventManager {
  constructor() {
    this.forms = {};
    this.fields = {
      events: {},
      pairFields: {}
    };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventManager();
    }
    return this.instance;
  }

  setForm(formId) {
    this.forms[formId] = {events: {}, pairFields: {}};
  }

  subscribe({formId, eventName, handler}) {
    const events = this.getEvents(formId);
    if (events) {
      events[eventName] = handler;
    }
  }

  unsubscribe({formId, eventName}) {
    const events = this.getEvents(formId);
    if (events) {
      delete events[eventName];
    }
  }

  update({formId, eventName, handler}) {
    const events = this.getEvents(formId);
    if (events) {
      events[eventName] = handler;
    }
  }

  /** add a list of handlers for future extension **/
  subscribeList({formId, eventName, handler}) {
    const events = this.getEvents(formId);
    if (events) {
      events[eventName] = events[eventName] || [];
      events[eventName] = events[eventName].concat([handler]);
    }
  }

  getEvents(formId) {
    if (!formId) {
      return this.fields.events
    }
    if (this.forms[formId]) {
      return this.forms[formId].events;
    }
    return false;
  }

  publish({formId, eventName, data}) {
    const events = this.getEvents(formId);
    if (events[eventName]) {
      events[eventName](data);
    }
  }

  subscribeCrossField(formId, pairFieldName, {fieldName, ruleName, validateRule}) {
    const fields = this.getFields(formId);
    fields[pairFieldName] = {fieldName, ruleName, validateRule};
  }

  unsubscribeCrossField(formId, pairFieldName) {
    const fields = this.getFields(formId);
    delete fields[pairFieldName];
  }

  /** add a list of handlers for future extension **/
  subscribeCrossFieldList(formId, pairFieldName, {fieldName, ruleName, validateRule}) {
    const fields = this.getFields(formId);
    fields[pairFieldName] = fields[pairFieldName] || [];
    fields[pairFieldName] = fields[pairFieldName].concat({fieldName, ruleName, validateRule});
  }

  getFields(formId) {
    return formId ? this.forms[formId].pairFields : this.fields.pairFields;
  }

  getCrossFieldData(formId, fieldName) {
    const fields = this.getFields(formId);
    return fields[fieldName];
  }

  removeForm(formId) {
    delete this.forms[formId];
  }

  removeField(fieldId, fieldName) {
    delete this.fields.events[`${EVENT_INVALID_FIELD}-${fieldId}`];
    delete this.fields.events[`${EVENT_FIELD_VIEW_UPDATE}-${fieldId}`];
    delete this.fields.pairFields[fieldName];
  }
}

export default EventManager.getInstance();
