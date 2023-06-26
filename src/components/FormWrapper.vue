<template>
  <div class="yo-v-form-wrapper">
    <FormValidator
        ref="form"
        :name="name"
        :mode="mode"
        :error-mode="errorMode"
        :valid="valid"
        v-slot="{ handleSubmit, isPristine, isDirty, isTouched, isUntouched, isValid, isInvalid }">
      <form @submit.prevent="handleSubmit(onFormValid)" novalidate>
        <slot name="content"></slot>
        <slot name="submit"
              :isPristine="isPristine"
              :isDirty="isDirty"
              :isTouched="isTouched"
              :isUntouched="isUntouched"
              :isValid="isValid"
              :isInvalid="isInvalid"></slot>
      </form>
    </FormValidator>
  </div>
</template>

<script>
import FormValidator from './FormValidator.vue';
import {ERROR_MODES, MODES} from "../validator/constants";

export default {
  name: 'FormWrapper',
  components: {
    FormValidator
  },
  props: {
    onFormValid: {
      required: true
    },
    name: {
      default: 'validationForm'
    },
    mode: {
      default: MODES.SUBMIT
    },
    errorMode: {
      default: ERROR_MODES.ALL
    },
    valid: {
      required: false
    }
  },
  methods: {
    reset: function () {
      this.$refs.form.reset();
    }
  }
}
</script>

<style>
</style>
