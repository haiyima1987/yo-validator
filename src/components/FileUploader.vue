<template>
  <div class="yo-v-field-wrapper" :style="{'width': fieldWidth}">
    <div class="image-and-input-wrapper">
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
        <div v-if="showFiles && input.length > 0">
          <p v-for="(file, index) of input" :key="index"
             :class="{ 'yo-v-error': errors.length > 0 || parsedErrors.length > 0 }">{{ file.name }}</p>
        </div>
        <label class="yo-v-button yo-v-label-file" ref="btnFile" :for="fieldName">
          <span class="placeholder">{{ placeholder }}</span>
          <input :accept="accept"
                 :id="fieldName"
                 :name="fieldName"
                 :multiple="isMultiple"
                 @change="handleChange"
                 type="file"
                 class="yo-v-input-file">
        </label>
        <div v-if="parsedErrors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of parsedErrors" :key=index class="yo-v-error">{{ error }}</p>
        </div>
        <div v-if="errors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of errors" :key=index class="yo-v-error">{{ error }}</p>
        </div>
      </FieldValidator>
    </div>
  </div>
</template>

<script>
import FieldValidator from './FieldValidator.vue';

const EVENT_VALUE_CHANGED = 'valueChanged';

export default {
  name: 'FileUploader',
  components: {
    FieldValidator
  },
  props: {
    // required
    fieldName: {
      required: true
    },
    // not required
    rules: {
      default: 'required|maxSize:100|ext:jpg,png,svg'
    },
    customErrors: {
      required: false
    },
    // html
    fieldTitle: {
      required: true
    },
    placeholder: {
      default: 'Select file'
    },
    fieldWidth: {
      default: '100%'
    },
    accept: {
      default: 'image/*'
    },
    isMultiple: {
      default: false
    },
    showFiles: {
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
    input: [],
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
    handleChange: function (e) {
      this.input = e.target.files;
      this.$emit(EVENT_VALUE_CHANGED, e.target.files);
    }
  },
  watch: {
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
