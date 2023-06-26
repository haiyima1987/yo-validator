<template>
  <component
      :is="tag"
      ref="fieldWrapper"
      class="yo-v-field-box">
    <slot :errors="errors"
          :validate="validate"
          :validateData="validateData"
          :setData="setData">
    </slot>
  </component>
</template>

<script>
import Validator from '../validator';

export default {
  name: 'FieldValidator',
  props: {
    fieldName: {
      type: String,
      required: true
    },
    rules: {
      type: String,
      required: true
    },
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
    errors: [],
    validateField: undefined,
    validateFieldByData: undefined,
    setData: undefined,
    setEventTarget: undefined,
    updateField: undefined
  }),
  methods: {
    getEventTarget: function () {
      const {fieldName} = this.$props;
      let targetList = this.$refs.fieldWrapper.querySelectorAll(`[name^=${fieldName}]`);
      if (targetList.length < 1) {
        targetList = this.$refs.fieldWrapper.querySelectorAll('input')
            || this.$refs.fieldWrapper.querySelectorAll('textarea')
            || this.$refs.fieldWrapper.querySelectorAll('select');
      }
      return Array.from(targetList);
    },
    setErrors: function (errors) {
      this.errors = errors;
    },
    validate: function () {
      this.validateField();
    },
    validateData: function (data) {
      this.validateFieldByData(data);
    },
    setFieldData: function (data) {
      this.setData(data);
    },
    initialize: function () {
      const properties = Validator.registerField({
        fieldName: this.$props.fieldName,
        rules: this.$props.rules,
        isCrossField: this.$props.isCrossField,
        delay: this.$props.delay,
        mode: this.$props.mode,
        errorMode: this.$props.errorMode,
        setErrors: this.setErrors
      });
      this.validateField = properties.validateField;
      this.validateFieldByData = properties.validateFieldByData;
      this.setData = properties.setData;
      this.setEventTarget = properties.setEventTarget;
      this.updateField = properties.updateField;
    },
    initializeEventTarget: function () {
      const target = this.getEventTarget();
      if (target !== undefined && target !== null && this.setEventTarget) {
        this.setEventTarget(target);
      }
    }
  },
  watch: {
    rules: function (newVal) {
      this.updateField(newVal, this.isCrossField);
      this.initializeEventTarget();
    },
    isCrossField: function (newVal) {
      this.updateField(this.rules, newVal);
      this.initializeEventTarget();
    }
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.initializeEventTarget();
  }
}
</script>
