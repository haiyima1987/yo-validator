<template>
  <component
      :is="tag"
      ref="formWrapper"
      class="yo-v-form-box">
    <slot :errors="errors"
          :isPristine="isPristine"
          :isDirty="isDirty"
          :isTouched="isTouched"
          :isUntouched="isUntouched"
          :isValid="isValid"
          :isInvalid="isInvalid"
          :handleSubmit="handleSubmit">
    </slot>
  </component>
</template>

<script>
import Validator from '../validator';
import {ERROR_MODES, MODES} from '../validator/constants';

export default {
  name: 'FormValidator',
  props: {
    mode: {
      default: MODES.SUBMIT
    },
    errorMode: {
      default: ERROR_MODES.ALL
    },
    valid: {
      required: false
    },
    name: {
      required: false
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
    setEventTarget: undefined,
    handleSubmit: undefined,
    removeForm: undefined,
    form: undefined
  }),
  methods: {
    getEventTarget: function () {
      return this.$refs.formWrapper.querySelector('fieldset');
    },
    setErrors: function (errors) {
      this.errors = errors;
    },
    setStatus: function (status) {
      for (const keyName in status) {
        this[keyName] = status[keyName];
      }
    },
    reset: function () {
      this.form.resetForm();
    },
    setValid: function () {
      if (this.$props.valid !== undefined && this.$props.valid !== null) {
        this.isValid = this.$props.valid;
      } else {
        this.isValid = Number(this.$props.mode) !== MODES.ACTIVE;
      }
      this.isInvalid = !this.isValid;
    },
    initialize: function () {
      const properties = Validator.registerForm({
        mode: this.$props.mode,
        name: this.$props.name,
        errorMode: this.$props.errorMode,
        valid: this.$props.valid,
        setErrors: this.setErrors,
        setStatus: this.setStatus
      });
      this.setEventTarget = properties.setEventTarget;
      this.handleSubmit = properties.handleSubmit;
      this.removeForm = properties.removeForm;
      this.form = properties.form;
      this.setValid();
    },
    initializeEventTarget: function () {
      const target = this.getEventTarget();
      if (target) {
        this.setEventTarget(target);
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
    this.removeForm();
  }
}
</script>
