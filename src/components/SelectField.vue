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
      <label :for="fieldName">
        <select
            :name="fieldName"
            :id="fieldName"
            :class="{ 'yo-v-error-field': errors.length > 0 || parsedErrors.length > 0 }"
            :multiple="isMultiple"
            v-model="input"
            @change="handleChange"
            class="yo-v-select">
          <option v-if="!isMultiple && placeholder"
                  value="" class="yo-v-option" selected>
            {{ placeholder }}
          </option>
          <option v-for="(option, index) in parsedOptions" :key="index"
                  :value="option.value"
                  class="yo-v-option">
            {{ option.text }}
          </option>
        </select>
      </label>
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
import FieldValidator from './FieldValidator.vue';

const EVENT_VALUE_CHANGED = 'valueChanged';

export default {
  name: 'SelectField',
  components: {
    FieldValidator
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
    input: '',
    parsedOptions: [],
    parsedErrors: []
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
    removeField: function () {
      this.$refs.validator.removeFormField();
    },
    handleChange: function () {
      this.$emit(EVENT_VALUE_CHANGED, this.input);
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
      if (value !== undefined && value !== null) {
        const option = this.parsedOptions.find(option => option.value === value);
        this.input = option ? option.value : this.input;
      }
    },
    checkValueMultiple: function (value) {
      if (value && Array.isArray(value)) {
        const options = this.parsedOptions.filter(option => value.includes(option.value));
        this.input = options ? options.map(option => option.value) : this.input;
      }
    },
    initialize: function () {
      this.input = this.$props.isMultiple ? [] : '';
      this.checkValue = this.$props.isMultiple ? this.checkValueMultiple : this.checkValue;
      this.initializeOptions();
      this.checkValue(this.$props.value);
    }
  },
  created() {
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
    }
  }
}
</script>

<style>
</style>
