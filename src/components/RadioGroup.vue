<template>
  <div class="yo-v-field-wrapper">
    <h3 v-if="!!fieldTitle" class="yo-v-title">{{ fieldTitle }}</h3>
    <FieldValidator
        :fieldName="fieldName"
        :rules="rules"
        :is-cross-field="isCrossField"
        :mode="mode"
        :error-mode="errorMode"
        :delay="delay"
        :tag="tag"
        v-slot="{errors}">
      <div :class="{ 'label-inline': isInline }"
           class="yo-v-label-group">
        <label v-for="(option, index) in options" :key="index"
               :for="`${fieldName}-${option.value}`"
               :class="{ 'label-inline': isInline }"
               class="yo-v-radio-label label-radio">
          <input :id="`${fieldName}-${option.value}`"
                 :name="`${fieldName}-${option.value}`"
                 :value="option.value"
                 v-model="input"
                 @change="handleChange"
                 type="radio"
                 class="yo-v-input-check">
          <span :class="{ 'yo-v-check-mark-error': errors.length > 0 || parsedErrors.length > 0 }"
                class="yo-v-check-mark">
          </span>
          <span class="yo-v-check-text">{{ option.text }}</span>
        </label>
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
import FieldValidator from './FieldValidator.vue';

const EVENT_VALUE_CHANGED = 'valueChanged';

export default {
  name: 'RadioGroup',
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
    fieldWidth: {
      default: '100%'
    },
    isInline: {
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
    input: undefined,
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
        this.parsedOptions.map(parsedOption => {
          if (parsedOption.value === value) {
            this.input = parsedOption.value;
          }
        })
      }
    },
    initialize: function () {
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
