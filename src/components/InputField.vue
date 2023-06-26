<template>
  <div :style="{'width': fieldWidth}" class="yo-v-field-wrapper">
    <h3 v-if="fieldTitle" class="yo-v-title">{{ fieldTitle }}</h3>
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
        <input
            ref="inputField"
            :type="type"
            :id="fieldName"
            :name="fieldName"
            :placeholder="placeholder"
            v-model="input"
            :class="{ 'yo-v-error-field': errors.length > 0 || parsedErrors.length > 0 }"
            class="yo-v-input"/>
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

export default {
  name: 'InputField',
  components: {
    FieldValidator
  },
  props: {
    // required
    fieldName: {
      required: true
    },
    type: {
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
      required: false
    },
    placeholder: {
      required: false
    },
    fieldWidth: {
      default: '100%'
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
    checkValue: function (value) {
      if (value !== undefined && value !== null) {
        this.input = value;
      }
    },
    initialize: function () {
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
