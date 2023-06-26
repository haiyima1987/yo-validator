<template>
  <component
      :is="tag"
      ref="fieldWrapper"
      class="yo-v-field-box">
    <slot
        :errors="errors"
        :isPristine="isPristine"
        :isDirty="isDirty"
        :isTouched="isTouched"
        :isUntouched="isUntouched"
        :isValid="isValid"
        :isInvalid="isInvalid"
        :validate="validate"
        :validateData="validateData"
        :setData="setData">
    </slot>
  </component>
</template>

<script>
import Validator from '../validator';
import {ERROR_MODES, MODES} from '../validator/constants';

export default {
  name: 'SingleFieldValidator',
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
      default: MODES.ACTIVE
    },
    errorMode: {
      default: ERROR_MODES.ALL
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
    isPristine: true,
    isDirty: false,
    isTouched: false,
    isUntouched: false,
    isValid: false,
    isInvalid: true,
    validateField: undefined,
    validateFieldByData: undefined,
    setData: undefined,
    updateRules: undefined,
    removeField: undefined
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
    setStatus: function (status) {
      for (const keyName in status) {
        this[keyName] = status[keyName];
      }
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
      const properties = Validator.registerSingleField({
        fieldName: this.$props.fieldName,
        rules: this.$props.rules,
        isCrossField: this.$props.isCrossField,
        delay: this.$props.delay,
        mode: this.$props.mode,
        errorMode: this.$props.errorMode,
        setErrors: this.setErrors,
        setStatus: this.setStatus
      });
      this.validateField = properties.validateField;
      this.validateFieldByData = properties.validateFieldByData;
      this.setData = properties.setData;
      this.setEventTarget = properties.setEventTarget;
      this.updateRules = properties.updateRules;
      this.removeField = properties.removeField;
    },
    initializeEventTarget: function () {
      const targetList = this.getEventTarget();
      if (targetList) {
        this.setEventTarget(targetList);
      }
    }
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.initializeEventTarget();
  },
  beforeUnmount() {
    this.removeField();
  }
}
</script>

<style>
</style>
