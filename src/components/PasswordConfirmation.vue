<template>
  <div :style="{'width': fieldWidth}">
    <div class="yo-v-field-wrapper">
      <h3 v-if="fieldTitle" class="yo-v-title">{{ fieldTitle }}</h3>
      <FieldValidator
          ref="validator"
          :fieldName="fieldName"
          :rules="`${rules}|${RULE_NAME_SAME}:@${fieldNameConfirm}`"
          :mode="mode"
          :error-mode="errorMode"
          :delay="delay"
          :tag="tag"
          v-slot="{errors}">
        <label :for="fieldName">
          <input :placeholder="placeholder"
                 :id="fieldName"
                 :name="fieldName"
                 v-model="input"
                 type="password"
                 autocomplete="off"
                 :class="{ 'yo-v-error-field': errors.length > 0 || parsedErrors.length > 0 }"
                 class="yo-v-input">
        </label>
        <div v-if="parsedErrors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of parsedErrors" :key=index class="yo-v-error">{{ error }}</p>
        </div>
        <div v-if="errors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of errors" :key=index class="yo-v-error">{{ error }}</p>
        </div>
      </FieldValidator>
    </div>
    <div class="yo-v-field-wrapper">
      <h3 v-if="fieldTitleConfirm" class="yo-v-title">{{ fieldTitleConfirm }}</h3>
      <FieldValidator
          :fieldName="fieldNameConfirm"
          :rules="rules"
          :is-cross-field="true"
          :mode="mode"
          :error-mode="errorMode"
          :delay="delay"
          :tag="tag"
          v-slot="{errors}">
        <label :for="fieldNameConfirm">
          <input :placeholder="placeholderConfirm"
                 :id="fieldNameConfirm"
                 :name="fieldNameConfirm"
                 v-model="inputConfirm"
                 type="password"
                 autocomplete="off"
                 :class="{ 'yo-v-error-field': errors.length > 0 || parsedErrors.length > 0 }"
                 class="yo-v-input">
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

const FIELD_NAME_PASSWORD = 'password';
const FIELD_NAME_CONFIRM = 'passwordConfirm';
const RULE_NAME_SAME = 'same';

export default {
  name: "PasswordConfirmation",
  components: {
    FieldValidator
  },
  props: {
    // required
    fieldName: {
      default: FIELD_NAME_PASSWORD
    },
    fieldNameConfirm: {
      default: FIELD_NAME_CONFIRM
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
    valueConfirm: {
      required: false
    },
    // html
    fieldTitle: {
      required: false
    },
    fieldTitleConfirm: {
      required: false
    },
    placeholder: {
      required: false
    },
    placeholderConfirm: {
      required: false
    },
    fieldWidth: {
      default: '100%'
    },
    // validator
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
    inputConfirm: '',
    parsedErrors: [],
    RULE_NAME_SAME
  }),
  methods: {
    validate: function () {
      this.$refs.validator.validate();
    },
    checkValue: function ({value, valueConfirm}) {
      if (value) {
        this.input = value;
      }
      if (valueConfirm) {
        this.inputConfirm = valueConfirm;
      }
    },
    initialize: function () {
      this.checkValue(this.$props);
    }
  },
  created() {
    this.initialize();
  },
  watch: {
    value: function (newVal) {
      this.input = newVal;
    },
    valueConfirm: function (newVal) {
      this.inputConfirm = newVal;
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
