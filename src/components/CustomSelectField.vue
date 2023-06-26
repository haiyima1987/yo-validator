<template>
  <div class="yo-v-field-wrapper">
    <h3 v-if="!!fieldTitle" class="yo-v-title">{{ fieldTitle }}</h3>
    <FieldValidator
        ref="validator"
        :fieldName="fieldName"
        :rules="rules"
        :is-cross-field="isCrossField"
        :mode="mode"
        :error-mode="errorMode"
        :delay="delay"
        :tag="tag"
        v-slot="{errors}">
      <div :id="ID_SELECT_WRAPPER" class="yo-v-custom-select-wrapper">
        <div @click="toggleSelect($event)"
             :class="{ 'yo-v-error-field': errors.length > 0 || parsedErrors.length > 0 }"
             class="yo-v-cs-text-wrapper">
          <div v-if="selectedOption" class="placeholder-yo-v-cs">{{ selectedOption.text }}</div>
          <div v-else class="selected-text-yo-v-cs">{{ placeholder }}</div>
        </div>
        <div v-if="isOpen" class="yo-v-cs-option-list-wrapper">
          <div class="yo-v-cs-option-list">
            <div v-for="(option, index) in parsedOptions" :key="index"
                 @click="handleClick($event, option)"
                 :class="{ 'selected': option.isSelected }"
                 class="option-yo-v-cs">
              {{ option.text }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedOptions.length > 0" class="yo-v-cs-selected-list">
        <div v-for="(option, index) in selectedOptions" :key="index"
             @click="removeOption(option)"
             class="tag-yo-v-cs-selected">{{ option.text }}
          <IconDelete class="icon-delete-yo-v-cs-selected"/>
        </div>
      </div>
      <div v-if="parsedErrors.length > 0" class="yo-v-error-messages">
        <p v-for="(error, index) of parsedErrors" :key=index class="yo-v-error">{{ error }}</p>
      </div>
      <div v-if="errors.length > 0" class="yo-v-error-messages">
        <p v-for="(error, index) of errors" :key=index class="yo-v-error">{{ error }}</p>
      </div>
    </FieldValidator>
  </div>
</template>

<script>
import {MODES} from '../validator/constants';
import FieldValidator from './FieldValidator.vue';
import IconDelete from '../generic/IconDelete.vue';

const EVENT_VALUE_CHANGED = 'valueChanged';
const ID_SELECT_WRAPPER = 'customSelectWrapper';

export default {
  name: "CustomSelectField",
  components: {
    FieldValidator,
    IconDelete
  },
  props: {
    // required
    fieldName: {
      required: true
    },
    options: {
      required: true
    },
    // not required
    rules: {
      default: 'required'
    },
    customErrors: {
      required: false
    },
    value: {
      required: false
    },
    // html
    fieldTitle: {
      required: true
    },
    placeholder: {
      default: 'Select an option'
    },
    fieldWidth: {
      default: '100%'
    },
    isMultiple: {
      default: false
    },
    // validator
    isCrossField: {
      default: false
    },
    mode: {
      required: false
    },
    errorMode: {
      required: false
    },
    delay: {
      default: 10
    },
    tag: {
      default: 'span'
    }
  },
  data: () => ({
    ID_SELECT_WRAPPER,
    input: '',
    parsedOptions: [],
    parsedErrors: [],
    selectedOption: undefined,
    selectedOptions: [],
    isOpen: false,
    setData: undefined,
  }),
  methods: {
    validate: function () {
      this.$refs.validator.validate();
    },
    validateData: function (data) {
      this.$refs.validator.validateData(data);
    },
    setFieldData: function (data) {
      this.$refs.validator.setFieldData(data);
    },
    validateOnSetData: function (data) {
      this.$refs.validator.setFieldData(data);
      this.$refs.validator.validate();
    },
    handleChange: function () {
      this.$emit(EVENT_VALUE_CHANGED, this.input);
    },
    handleClick: function (e, option) {
      e.stopPropagation();
      this.onOptionSelected(option);
      this.setData(this.input);
      this.$emit(EVENT_VALUE_CHANGED, this.input);
    },
    onOptionSelected: function (option) {
      this.parsedOptions = this.parsedOptions.map(parsedOption => {
        parsedOption.isSelected = parsedOption.value === option.value;
        return parsedOption
      })
      this.selectedOption = option;
      this.input = option.value;
      this.isOpen = false;
    },
    onOptionSelectedMultiple: function (option) {
      option.isSelected = !option.isSelected;
      this.selectedOptions = this.parsedOptions.filter(parsedOption => parsedOption.isSelected);
      this.input = this.selectedOptions.map(option => option.value);
    },
    removeOption: function (option) {
      option.isSelected = false;
      this.selectedOptions = this.parsedOptions.filter(parsedOption => parsedOption.isSelected);
      this.input = this.selectedOptions.map(option => option.value);
      this.setData(this.input);
    },
    toggleSelect: function (e) {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
    },
    checkEvent: function (e) {
      if (!document.getElementById(ID_SELECT_WRAPPER).contains(e.target)) {
        this.isOpen = false
      }
    },
    initializeOptions: function () {
      const options = this.$props.options;
      if (options && Array.isArray(options)) {
        this.parsedOptions = options.map((option, index) => {
          const value = option.value ? option.value : index + 1;
          const text = option.text ? option.text : option;
          return {value, text};
        });
      }
    },
    checkValue: function (value) {
      if (value) {
        this.parsedOptions = this.parsedOptions.map(parsedOption => {
          if (parsedOption.value === value) {
            parsedOption.isSelected = true;
            this.selectedOption = parsedOption;
            this.input = parsedOption.value;
          } else {
            parsedOption.isSelected = false;
          }
          return parsedOption
        })
        this.setData(this.input);
      }
    },
    checkValueMultiple: function (value) {
      if (value && Array.isArray(value)) {
        this.parsedOptions = this.parsedOptions.map(parsedOption => {
          if (value.includes(parsedOption.value)) {
            parsedOption.isSelected = true;
            this.selectedOptions = this.selectedOptions.concat(parsedOption);
            this.input = this.input.concat(parsedOption.value);
          } else {
            parsedOption.isSelected = false;
          }
          return parsedOption
        })
        this.setData(this.input);
      }
    },
    initialize: function () {
      this.input = this.$props.isMultiple ? [] : '';
      this.checkValue = this.$props.isMultiple ? this.checkValueMultiple : this.checkValue;
      this.onOptionSelected = this.$props.isMultiple ? this.onOptionSelectedMultiple : this.onOptionSelected;
      this.setData = this.$props.mode === MODES.ACTIVE ? this.validateOnSetData : this.setFieldData;
      this.initializeOptions();
      this.checkValue(this.$props.value);
    }
  },
  mounted() {
    this.initialize();
  },
  watch: {
    value: function (newVal) {
      this.checkValue(newVal);
    },
    customErrors: function (newVal) {
      const errors = typeof newVal === "string" ? [newVal] : newVal;
      if (Array.isArray(errors)) {
        this.parsedErrors = errors;
      }
    },
    isOpen: function (newVal) {
      newVal ? document.addEventListener('click', this.checkEvent) : document.removeEventListener('click', this.checkEvent);
    }
  }
}
</script>

<style>
</style>
