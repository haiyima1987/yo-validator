# YoValidator

YoValidator is a form validation tool for Vue 3.

## 1. Get started

```
npm install yo-validator
```

After installing the package, add YoValidator to your main.js.

```
import {createApp} from 'vue';
import YoValidator from "yo-validator";
// create app
const app = createApp(App);
// add YoValidator
app.use(YoValidator).mount('#app');
```

Alright. Now you can start using YoValidator's components. 
YoValidator installs useful built-in components for you. 
The components will be explained below.

## 2. FormValidator component

FormValidator is a wrapper component to wrap your form inside. 
This component validates your form and send data back to you in an object if all fields are valid.

Example:

```
<template>
  <FormValidator
      ref="form"
      v-slot="{ handleSubmit, isPristine, isDirty, isTouched, isUntouched, isValid, isInvalid }">
    <form @submit.prevent="handleSubmit(onFormValid)" novalidate>
      ...
    </form>
  </FormValidator>
</template>
```

### 2.1 FormValidator props

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|      mode       |       1       |  false   |        1, 2, 3        |
|    errorMode    |       1       |  false   |         1, 2          |
|      valid      |       -       |  false   |        Boolean        |
|      name       |       -       |  false   |        String         |
|       tag       |     span      |  false   |       HTML tag        |

### 2.2 FormValidator props

* mode: __1 (SUBMIT), 2 (LAZY), and 3 (ACTIVE)__
  * __1__: All fields are validated when the submit button is clicked.
  * __2__: The text fields are validated on "__blur__". Checkbox, radio, select, and file fields are validated on "__change__".
  * __3__: The text fields are validated on "__input__". Checkbox, radio, select, and file fields are validated on "__change__".
* error mode: __1 (ALL) and 2 (ONE)__
  * __1__: All errors are shown.
  * __2__: Errors are shown 1 by 1.
* valid: this prop indicates if the form is valid by default.
* name: this prop gives a name to a form.
* tag: this prop defines the wrapper HTML tag of a form validator.

### 2.3 FormValidator slot props

#### handleSubmit

The validation of a form is performed by the function __handleSubmit__. handleSubmit takes a function as parameter. 
The function is up to you to define. The parameter of your own function is the data object of the entire form. 
This is because YoValidator gets all data and send it to you in an object after all fields are validated and all rules passed.
Your own function will be called inside handleSubmit after you click the submit button.

Example:

```
<template>
  <FormValidator ref="form" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onFormValid)" novalidate>
      ...
    </form>
  </FormValidator>
</template>

<script>
export default {
  name: "Form",
  setup() {
    const onFormValid = (validData) => {
      console.log(validData);
    };
    return {
      onFormValid
    }
  }
}
</script>
```

#### isPristine, isDirty, isTouched, isUntouched, isValid, isInvalid

These are just common flags for form status.
* isPristine: true if no field's input or change event is triggered
* isDirty: true if at least 1 field's input or change event is triggered
* isUntouched: true if no field's blur or change event is triggered
* isTouched: true if at least 1 field's blur or change event is triggered
* isValid: true if all fields are valid
* isInvalid: true if at least 1 field is invalid

### 2.4 FormValidator ref method to reset errors

FormValidator also offers a ref methods "__reset__" to programmatically reset your form errors.
Inside your code, add a "__ref__", e.g. "__form__", to your FormValidator. 
Then you can reset the form errors using "__this.$refs.form.reset()__" or corresponding implementation in composition API setup().

## 3. FieldValidator component

FieldValidator is a wrapper component to wrap each field. This component validates each field. 
Keep in mind that 1 FieldValidator can ONLY contain 1 field input.
Also, keep in mind that the FieldValidator components MUST be wrapped inside a FormValidator.

Example:
```
<template>
  <FormValidator ref="form" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onFormValid)" novalidate>
      <FieldValidator
          ref="validator"
          :fieldName="'username'"
          :rules="'required|minLength:8|numeric'"
          v-slot="{errors}">
        <label for="username">
          <input
              ref="inputField"
              type="text"
              name="username"
              class="yo-v-input"/>
        </label>
        <div v-if="errors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of errors" :key="index" class="yo-v-error">{{ error }}</p>
        </div>
      </FieldValidator>
      <div>
        <button type="submit" class="yo-v-button-submit button-save">SAVE</button>
      </div>
    </form>
  </FormValidator>
</template>
```

### 3.1 FieldValidator props

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|    fieldName    |       -       |   true   |        String         |
|      rules      |       -       |   true   |        String         |
|  isCrossField   |     false     |  false   |        Boolean        |
|      mode       |       -       |  false   |        1, 2, 3        |
|    errorMode    |       -       |  false   |         1, 2          |
|      delay      |      10       |  false   |        Number         |
|       tag       |     span      |  false   |       HTML tag        |

### 3.2 FieldValidator props

* fieldName: the name of the field, must be unique. The fieldName will become the property key name in returned data object of the entire form.
* rules: the rules of the field for validation
  1. Separate different rules with "__|__", like "__required|numeric|email__".
  2. Use camelCase, like "__minLength__", "__maxSize__", etc.
  3. Define the rule limit after a "__:__", like "__minLength:8__".
  4. For cross fields, use "__@__" after "__:__" to point at the pair field's __fieldName__, like "__confirm:@passwordRepeat__", "__smallerThan:@fatherAge__", etc.
  5. It is possible to update rules after initialization. Since FieldValidator has a Vue watch for your rules.
* isCrossField: set the value to true if it's a __pair field__. A pair field means it's a field another cross field points at, like passwordRepeat is the pair field for password.
* mode: __1 (SUBMIT), 2 (LAZY), and 3 (ACTIVE)__
  * Set the value only if you want a field to have a different mode from the form. Or else the field will take the form's mode.
* error mode: __1 (ALL) and 2 (ONE)__
  * Set the value only if you want a field to have a different error mode from the form. Or else the field will take the form's error mode.
* delay: the delay of validation after an input or change event. Only available in Active mode and for checkbox, radio, select, and file fields in Lazy mode.
* tag: this prop defines the wrapper HTML tag of a field validator.

### 3.3 Supported rules and examples

| Supported props |         Example         |             Extra explanation              |
|:---------------:|:-----------------------:|:------------------------------------------:|
|    required     |        required         |                     -                      |
|      alpha      |          alpha          |                     -                      |
|  alphaNumeric   |      alphaNumeric       |                     -                      |
|     numeric     |         numeric         |                     -                      |
|      email      |          email          |                     -                      |
|     maxSize     |       maxSize:50        |        For files, 50 indicates 50KB        |
|     minSize     |       minSize:50        |        For files, 50 indicates 50KB        |
|    maxLength    |       maxLength:8       | For text lengths, 8 indicates 8 characters |
|    minLength    |       minLength:8       | For text lengths, 8 indicates 8 characters |
|       max       |         max:100         |                For numbers                 |
|       min       |         min:100         |                For numbers                 |
|       ext       |     ext:jpg,png,svg     |            For file extensions             |
|     confirm     | confirm:@passwordRepeat |    Write pair field's fieldName after @    |

### 3.4 FieldValidator slot props

#### errors
An array containing errors after validation.

#### validate
A function to trigger manual validation, e.g. in a custom field.

#### validateData
A function to send data to YoValidator and validate it, e.g. in a custom field.

#### setData
A function to send data to YoValidator for later validation, e.g. in a custom field.

### 3.5 Custom field with FieldValidator

To continue on the slot props above. Below is an example of custom fields using "__validateData__" and "__setData__"

Example of custom fields using validateData and setData:

```
<template>
  <div>
    ...
    <FieldValidator
        :fieldName="'name'"
        :rules="'required'"
        v-slot="{errors, setData, validate, validateData}">
      <YourCustomField @valueChanged="(newVal) => setData(newVal)">
        <div v-if="errors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of errors" :key="index" class="yo-v-error">{{ error }}</p>
        </div>
      </YourCustomField>
    </FieldValidator>
    <FieldValidator
        :fieldName="'age'"
        :rules="'required|numeric'"
        v-slot="{errors, setData, validate, validateData}">
      <YourCustomField @valueChanged="(newVal) => validateData(newVal)">
        <div v-if="errors.length > 0" class="yo-v-error-messages">
          <p v-for="(error, index) of errors" :key="index" class="yo-v-error">{{ error }}</p>
        </div>
      </YourCustomField>
    </FieldValidator>
    ...
  </div>
</template>
```

Imagine you have a form with Submit mode, the field1 and field2 are custom fields. Firstly you wrap the custom fields inside FieldValidator. 
Then you can use setData to set the data manually to YoValidator for field1, later it will be validated.
Furthermore, you want field2 to be validated immediately. Therefore, validateData is used to set data and validate it.

_Tip: YoValidator detects only input, textarea, and select. Therefore, you need to set the data and validate manually for custom fields._

## 4 Custom rules

You can define your own rule as well in YoValidator.

### 4.1 Define a custom rule

Example of setting a custom rule:

```
// in main.js (initialization)
import YoValidator from 'yo-validator';
// get the function
const {setRule} = YoValidator;
// define validator
const validator = {
  getMessage: (fieldName, args, selectedLang) => {
    const numbers = args.split(',').join(', ');
    return `The correct guesses for your ${fieldName} field are ${numbers}`;
  },
  validate: (data, args) => {
    return args.includes(data);
  }
}
// set rule
setRule('isIn', validator);

// in your template
<template>
  ...
  <FieldValidator
      :fieldName="'numberGuesser'"
      :rules="'isIn:3,6,9'">
    <label for="number">
      <input 
          type="text"
          name="numberGuesser"
          class="yo-v-input"/>
    </label>
  </FieldValidator>
  ...
</template>
```
This is an example of a custom rule "__isIn__", which means the user input is only valid when the input is one of the numbers you defined.

* It's simple to add your own rule. Just get the "__setRule__" function. Then define an object with getMessage and validate as 2 properties.
* The validate function takes data (user input) as the first param, and args as second. In this case, the 2nd param is "__[3, 6, 9]__" (an array).
* The getMessage takes fieldName as the first param and the args as second. In this case, the 2nd param is "__3,6,9__" (a string).
* Keep in mind that the args is returned as a string by default in getMessage but returned as an array in validate by default.
* As you can see, the 3rd param in getMessage is "__selectedLang__". This is useful when you have a multilingual app. 
You can write different messages depending on selected language.

### 4.2 Define a custom rule for cross field validation

Example of setting a custom rule for cross field:

```
// in main.js (initialization)
import YoValidator from 'yo-validator';
// get the function
const {setRule} = YoValidator;
// define validator
const validator = {
  getMessage: (fieldName, pariFieldName, selectedLang) => {
    return `The ${fieldName} field value must be smaller than ${pariFieldName} field`;
  },
  validate: (data, dataPairField) => {
    return Number(data) < Number(dataPairField);
  }
}
// set rule
setRule('smallerThan', validator, {isCrossField: true});

// in your template
<template>
  <div>
    ...
    <FieldValidator
        :fieldName="'myAge'"
        :rules="'required|smallerThan:@fatherAge'">
      <label for="myAge">
        <input
            type="number"
            name="myAge"
            class="yo-v-input"/>
      </label>
    </FieldValidator>
    <FieldValidator
        :is-cross-field="true"
        :fieldName="'fatherAge'"
        :rules="'required'">
      <label for="fatherAge">
        <input
            type="number"
            name="fatherAge"
            class="yo-v-input"/>
      </label>
    </FieldValidator>
    ...
  </div>
</template>
```
This is an example of a cross field custom rule "__smallerThan__", the rule name is self-explanatory.

* Similar like the previous example, just get the "__setRule__" function. Then define an object with getMessage and validate as 2 properties.
* The validate function takes data (user input) as the first param, and data of fatherAge field as second.
Finally, you can just compare the 2 values in your validate function.
* The getMessage takes fieldName as the first param and the pairFieldName as second param. In this case, the 2nd param is "__fatherAge__".
* Keep in mind that the setRule function takes the 3rd param "__{isCrossField: true}__", this is a must for cross fields.
* The 2nd FieldValidator in template sets the prop isCrossField as true, which is a must as well.

## 5. Locales and custom error messages

As you can see above, it can get complex to define your own error messages in getMessage. Since you need to consider language, fieldName, etc.
However, that doesn't happen often. Unless you need to play with args for rendering error messages, you do need to have your own getMessage. 
Most of the time you can simply define your locales with sets of common error messages, then problem solved.

### 5.1 Locales and messages on initialization

Example of setting up locales/messages on initialization

```
// get setMessages from YoValidator in main.js
const {setMessages} = YoValidator;
// define your locales/messages
const messages = {
  locale: 'en',
  en: {
    names: {
      username: 'username',
      email: 'email',
      profile: 'profile image',
    },
    messages: {
      default: 'Invalid field.',
      required: {
        default: 'Your {fieldName} is required.',
        username: 'Your must fill in {fieldName}.',
        email: 'Please fill in your {fieldName}.'
      },
      numeric: {
        default: 'Your {fieldName} can only contain numbers.'
      },
      email: {
        default: 'Your {fieldName} is not a valid email.'
      },
      ext: {
        default: 'The extension of your {fieldName} can only be {ext}.',
        profile: 'You have to upload files in correct types - {ext}.',
      },
      maxLength: {
        default: 'Your {fieldName} cannot be longer than {maxLength} characters.'
      },
      maxSize: {
        default: 'Your {fieldName} cannot be larger than {maxSize}KB.'
      },
      confirm: {
        default: 'Your passwords do not match.'
      }
    }
  },
  nl: {
    names: {
      username: 'username',
      email: 'e-mailadres',
      profile: 'profiel foto',
    },
    messages: {
      default: 'Ongeldig veld.',
      required: {
        default: 'Uw {fieldName} is verplicht.',
        username: 'Je moet {fieldName} invullen.',
        email: 'Vul uw {fieldName} in.'
      },
      numeric: {
        default: 'Uw {fieldName} mag alleen cijfers bevatten.'
      },
      email: {
        default: 'Uw {fieldName} is geen geldig e-mailadres.'
      },
      ext: {
        default: 'De extensie van uw {fieldName} mag alleen {ext} zijn.',
        profile: 'Je hebt bestanden van het juiste type geüpload - {ext}.'
      },
      maxLength: {
        default: 'Uw {fieldName} mag niet langer zijn dan {maxLength} tekens.'
      },
      maxSize: {
        default: 'Uw {fieldName} mag niet groter zijn dan {maxSize}KB.'
      },
      confirm: {
        default: 'Uw wachtwoorden komen niet overeen.'
      }
    }
  },
  zh: {
    ...
  },
  ar: {
    ...
  },
  ...
}
// set messages to YoValidator
setMessages(messages);
```

Most of the example above is self-explanatory.
* The "__names__" are used to replace the fieldName. If not defined, then fieldName itself is used.
* Each rule has a default error message. If needed, define separate error messages with fieldName as property key name, e.g. rule required also has 2 different messages for username and email.
* The "__default__" as the direct child of messages is a fallback error message if the messages are not property defined. 
* The placeholder of the rule name will be replaced by "__args__". For instance, '... {maxSize}KB' will become '... 50KB' if your rule is 'maxSize:50' in your template.

### 5.2 Group field names and messages

YoValidator also supports "__group fields__", for instance, you allow users to dynamically add a list of skills in your app by "+" and "-" buttons. 
The fieldNames then become skill-1, skill-2, ..., skill-n. However, you don't want your error messages to be like "Your skill-1 is required.". 

To render nice error messages, you can use the example below.

#### Group field name replaced by one word

Example: group field name replaced by one word and its corresponding error message

```
// get setMessages from YoValidator in main.js
const {setMessages} = YoValidator;
// define your locales/messages
const messages = {
  locale: 'en',
  en: {
    names: {
      ...
      'skill-*': 'skill',
      ...
    },
    messages: {
      default: 'Invalid field.',
      required: {
        default: 'Your {fieldName} is required.',
        'skill-*': 'You cannot leave the {fieldName} field empty.',
      },
      ...
    }
  },
  ...
}
// set messages to YoValidator
setMessages(messages);
...
// in your template
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <div v-for="(skill, index) of skills" :key="index">
        <InputField
            :field-title="`Skill title`"
            :field-name="`skill-${index}`"
            :rules="'required'"
            :placeholder="'Enter your skill'">
        </InputField>
      </div>
      ...
    </template>
    ...
  </FormWrapper>
</template>
```

* You can use "__skill-*__" to represent the group of fields (your fieldName + "-*").
* Keep in mind that your group fieldName MUST use "__-__" to connect fieldName text and index.

#### Group field name replaced by a function

Example: group field name replaced by a function and its corresponding error message

```
// get setMessages from YoValidator
const {setMessages} = YoValidator;
// define your locales/messages
const messages = {
  locale: 'en',
  en: {
    names: {
      ...
      'skill-*': (fieldName) => {
        // here fieldName is "skill-1", "skill-2", ..., "skill-n"
        console.log(fieldName);
        // do whatever you want, this example just gets the fieldName text and return it.
        return fieldName.split('-')[0];
      },
      ...
    },
    messages: {
      default: 'Invalid field.',
      required: {
        default: 'Your {fieldName} is required.',
        'skill-*': 'You cannot leave the {fieldName} field empty.',
      },
      ...
    }
  },
  ...
}
// set messages to YoValidator
setMessages(messages);
```

* You can also use a function to format the fieldName to whatever you like.
* The rest are the same as the previous example.

## 6. Set locales and custom error messages programmatically

### 6.1 Locales and messages

YoValidator can be added globally to set messages and switch between languages programmatically.

Example of using globalProperties

```
// in main.js
import YoValidator from "yo-validator";
// add it globally
app.config.globalProperties.$validator = YoValidator;
// in your script
...
methods: {
  switchLang: function (lang) {
    this.$validator.setLanguage(lang);
  },
  // messages that come in later, e.g. from an API
  setErrorMessages: function (messages) {
    // here keep in mind that the messages need to have the same structure as shown in 5.1
    this.$validator.setMessages(messages);
  },
...
```

Example of using provide/inject

```
// in main.js
import YoValidator from "yo-validator";
// add it globally using provide
app.provide('$validator', YoValidator);
// in your script
...
setup() {
  // inject it
  const $validator = inject('$validator');
  const switchLang = (lang) => {
    $validator.setLanguage(lang);
  };
  // messages that come in later, e.g. from an API
  const setErrorMessages = (messages) => {
    // here keep in mind that the messages need to have the same structure as shown in 5.1
    $validator.setMessages(messages);
  }
  return {
    onValueChanged,
    setErrorMessages
  }
},
...
```

### 6.2 Other error message related functions

YoValidator also allows the calling of other error message related functions programmatically.

* YoValidator allows "__this.$validator.setRule(...)__", how to use "__setRule__" is shown in 4.2.
* YoValidator allows "__this.$validator.resetFormByName(...)__" to reset form errors, if you pass a name as prop for FormValidator (2.1) and FormWrapper (will be explained below).

## 7. Built-in form and field components

YoValidator offers a list of built-in form and field components. These components are easy to use if you don't need special styling.

### 7.1 FormWrapper

FormWrapper contains a form inside and 2 slots: content and submit.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
    </template>
    <template #submit>
      <div class="button-submit-wrapper">
        <button type="submit" class="yo-v-button-submit button-save">SAVE</button>
      </div>
    </template>
  </FormWrapper>
</template>
```

| Supported props |  Default value  | Required | Supported values/type |
|:---------------:|:---------------:|:--------:|:---------------------:|
|   onFormValid   |        -        |   true   |       Function        |
|      mode       |        1        |  false   |        1, 2, 3        |
|    errorMode    |        1        |  false   |         1, 2          |
|      valid      |        -        |  false   |        Boolean        |
|      name       | validationForm  |  false   |        String         |

* The function that gets all the data is onFormValid.
* The rest of the props are same as FormValidator

#### FormWrapper ref method to reset form errors

Same as FormValidator, you can also add a ref, e.g. "__formWrapper__", to FormWrapper. 
Then use "__this.$refs.formWrapper.reset()__" or corresponding implementation in composition API setup().

### 7.2 Field components introduction

Field components are InputField, TextField, CheckboxGroup, RadioGroup, FileUploader, SelectField, PasswordConfirmation, and CustomSelectField.

Each component has a FieldValidator inside to help with field validation.

#### Shared props by all field components

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|    fieldName    |       -       |   true   |        String         |
|      rules      |   required    |  false   |        String         |
|  customErrors   |       -       |  false   |     Array<String>     |
|   fieldTitle    |       -       |  false   |        String         |
|   fieldWidth    |     100%      |  false   |        String         |
|      mode       |       -       |  false   |        1, 2, 3        |
|    errorMode    |       -       |  false   |         1, 2          |
|      delay      |      10       |  false   |        Number         |
|       tag       |     span      |  false   |       HTML tag        |

* The fieldName must be passed in.
* You can use "__customErrors__" to render your own error upon YoValidator errors, e.g. error returned after API call.
* YoValidator renders a field title with h3 tag. The text is "__fieldTitle__".
* Your field wrapper element's width is defined by "__fieldWidth__".
* The rest of the props are the same as the ones explained in FieldValidator.

### 7.3 InputField

InputField contains an input inside.

#### Props besides shared ones

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|      type       |       -       |   true   |   HTML input types    |
|      value      |       -       |  false   |    String, Number     |
|   placeholder   |       -       |  false   |        String         |
|  isCrossField   |     false     |  false   |        Boolean        |

* The "__value__" is useful for use cases like an edit page. You can define default value.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <InputField
          :field-title="'Username'"
          :field-name="'username'"
          :rules="'required|minLength:8'"
          :type="'text'"
          :placeholder="'Enter your username'">
      </InputField>
      ...
    </template>
    ...
  </FormWrapper>
</template>
```

### 7.4 TextField

TextField contains a textarea inside.

#### Props besides shared ones

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|      type       |       -       |   true   |      text, email      |
|      value      |       -       |  false   |    String, Number     |
|   placeholder   |       -       |  false   |        String         |
|      rows       |       4       |  false   |        Number         |
|  isCrossField   |     false     |  false   |        Boolean        |

* The "__value__" is useful for use cases like an edit page. You can define default value.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <TextField
          :field-title="'Description'"
          :field-name="'description'"
          :rules="'required|maxLength:1000'"
          :placeholder="'Enter your description'">
      </TextField>
      ...
    </template>
    ...
  </FormWrapper>
</template>
```

### 7.5 CheckboxGroup

CheckboxGroup contains checkboxes inside.

#### Props/Events besides shared ones

| Supported props/events | Default value | Required | Supported values/type |
|:----------------------:|:-------------:|:--------:|:---------------------:|
|        options         |       -       |   true   |         Array         |
|  valueChanged (event)  |       -       |  false   |       Function        |
|         value          |       -       |  false   | See explanation below |
|        isInline        |     false     |  false   |        Boolean        |
|      isCrossField      |     false     |  false   |        Boolean        |

About "__options__":
* The "__options__" are internally parsed into an array of objects to render checkboxes, e.g. [{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}, ...].
  * The property "__text__" of each object in the option array ({value: 1, __"text: 'Option 1'__}) comes from the array values you passed in as prop, e.g. __:options="['Option 1', 'Option 2', 'Option 3']"__ (see example below). The parsing is done internally.
  * You can also directly pass an array of objects as prop, e.g. __:options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}, ...]"__. This way the internal parsing is skipped.
* Just keep in mind that if you pass in an array of objects as prop, each object MUST have a "__value__" property and a "__text__" property.
* The "__valueChanged__" will return the selected array of "__value__"s back to you. See example below.
* If you only pass in an array of strings as "__options__", the returned values will be automatically generated values, e.g. [1, 2, 3].

About "__value__":
* If you pass in "__value__" prop, the value MUST be an array of values either defined by yourself or automatically generated.

About "__isInline__":
* This is just a prop for styling, when set to true, checkboxes are aligned inline.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <CheckBoxGroup
          :field-title="'Check your options'"
          :field-name="'checkboxGroup'"
          :rules="'required'"
          :is-inline="true"
          @valueChanged="onValueChanged"
          :options="['Option 1', 'Option 2', 'Option 3']">
      </CheckBoxGroup>
      ...
    </template>
    ...
  </FormWrapper>
</template>
<script>
...
  setup() {
    const onValueChanged = (values) => {
      console.log(values);
    };
    return {
      onValueChanged
    }
  }
...
</script>
```

### 7.6 RadioGroup

RadioGroup contains radio buttons inside.

#### Props/Events besides shared ones

| Supported props/events | Default value | Required | Supported values/type |
|:----------------------:|:-------------:|:--------:|:---------------------:|
|        options         |       -       |   true   |         Array         |
|  valueChanged (event)  |       -       |  false   |       Function        |
|         value          |       -       |  false   | See explanation below |
|        isInline        |     false     |  false   |        Boolean        |
|      isCrossField      |     false     |  false   |        Boolean        |

About "__options__":
* The "__options__" are internally parsed into an array of objects to render radio buttons, e.g. [{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}, ...].
  * The property "__text__" of each object in the option array ({value: 1, __"text: 'Option 1'__}) comes from the array values you passed in as prop, e.g. __:options="['Option 1', 'Option 2', 'Option 3']"__ (see example below). The parsing is done internally.
  * You can also directly pass an array of objects as prop, e.g. __:options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}, ...]"__. This way the internal parsing is skipped.
* Just keep in mind that if you pass in an array of objects as prop, each object MUST have a "__value__" property and a "__text__" property.
* The "__valueChanged__" will return the selected "__value__" back to you. See example below.
* If you only pass in an array of strings as "__options__", the returned value will be automatically generated value, e.g. 1, 2, or 3.

About "__value__":
* If you pass in "__value__" prop, the value MUST be a value either defined by yourself or automatically generated.

About "__isInline__":
* This is just a prop for styling, when set to true, radio buttons are aligned inline.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <RadioGroup
          :field-title="'Choose your option'"
          :field-name="'radioGroup'"
          :rules="'required'"
          :is-inline="true"
          @valueChanged="onValueChanged"
          :options="['Option 1', 'Option 2', 'Option 3']">
      </RadioGroup>
      ...
    </template>
    ...
  </FormWrapper>
</template>
<script>
...
  setup() {
    const onValueChanged = (value) => {
      console.log(value);
    };
    return {
      onValueChanged
    }
  }
...
</script>
```

### 7.7 FileUploader

FileUploader contains a file input inside.

#### Props/Events besides shared ones

| Supported props/events | Default value | Required | Supported values/type |
|:----------------------:|:-------------:|:--------:|:---------------------:|
|      placeholder       |  Select file  |  false   |        String         |
|  valueChanged (event)  |       -       |  false   |       Function        |
|         accept         |    image/*    |  false   |        String         |
|       isMultiple       |     false     |  false   |        Boolean        |
|       showFiles        |     false     |  false   |        Boolean        |
|      isCrossField      |     false     |  false   |        Boolean        |

* The "__showFiles__" shows file names you uploaded if it's set to true.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <FileUploader
          :field-title="'Upload your file'"
          :field-name="'profile'"
          :rules="'required|maxSize:100'"
          @valueChanged="onValueChanged">
      </FileUploader>
      ...
    </template>
    ...
  </FormWrapper>
</template>
<script>
...
  setup() {
    const onValueChanged = (file) => {
      console.log(file);
    };
    return {
      onValueChanged
    }
  }
...
</script>
```

### 7.8 SelectField

SelectField contains a select inside.

#### Props/Events besides shared ones

| Supported props/events | Default value | Required | Supported values/type |
|:----------------------:|:-------------:|:--------:|:---------------------:|
|        options         |       -       |   true   |         Array         |
|  valueChanged (event)  |       -       |  false   |       Function        |
|         value          |       -       |  false   | See explanation below |
|       isMultiple       |     false     |  false   |        Boolean        |
|      isCrossField      |     false     |  false   |        Boolean        |

About "__value__" and "__isMultiple__"

* YoValidator's SelectField support single and multiple select by the prop value of "__isMultiple__". Therefore, the requirements for "__value__" is also different.
* In general, the requirements of "__options__" and "__value__" when "__isMultiple__" is false are the same as RadioGroup.
* the requirements of "__options__" and "__value__" when "__isMultiple__" is true are the same as CheckboxGroup.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <SelectField
          :field-title="'Select your option(s)'"
          :field-name="'selectGroup'"
          @valueChanged="onValueChanged"
          :options="['Option 1', 'Option 2', 'Option 3']">
      </SelectField>
      ...
    </template>
    ...
  </FormWrapper>
</template>
<script>
...
  setup() {
    const onValueChanged = (file) => {
      console.log(file);
    };
    return {
      onValueChanged
    }
  }
...
</script>
```

### 7.9 CustomSelectField

CustomSelectField contains a custom select inside. Since HTML native select is hard to style and sometimes feels a little out-dated.
This is also a custom field YoValidator offers. You can reference this one if you want to make your own custom field.

#### Props/Events besides shared ones

| Supported props/events | Default value | Required | Supported values/type |
|:----------------------:|:-------------:|:--------:|:---------------------:|
|        options         |       -       |   true   |         Array         |
|  valueChanged (event)  |       -       |  false   |       Function        |
|         value          |       -       |  false   | See explanation below |
|       isMultiple       |     false     |  false   |        Boolean        |
|      isCrossField      |     false     |  false   |        Boolean        |

About "__value__" and "__isMultiple__"

* Same as SelectField

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <CustomSelectField
          :field-title="'Select your option(s)'"
          :field-name="'customSelectGroup'"
          :is-multiple="true"
          @valueChanged="onValueChanged"
          :options="['Option 1', 'Option 2', 'Option 3']">
      </CustomSelectField>
      ...
    </template>
    ...
  </FormWrapper>
</template>

<script>
  ...
  setup() {
    const onValueChanged = (value) => {
      console.log(value);
    };
    return {
      onValueChanged
    }
  }
  ...
</script>
```

### 7.10 PasswordConfirmation

PasswordConfirmation contains 2 password fields for password confirmation.

#### Props besides shared ones

|  Supported props   |  Default value  | Required | Supported values/type |
|:------------------:|:---------------:|:--------:|:---------------------:|
|     fieldName      |    password     |  false   |        String         |
|  fieldNameConfirm  | passwordConfirm |  false   |        String         |
|       value        |        -        |  false   |    String, Number     |
|    valueConfirm    |        -        |  false   |    String, Number     |
|     fieldTitle     |        -        |  false   |        String         |
| fieldTitleConfirm  |        -        |  false   |        String         |
|    placeholder     |        -        |  false   |        String         |
| placeholderConfirm |        -        |  false   |        String         |

* The "__value__" and "__valueConfirm__" are useful for use cases like an edit page. You can define default values.

Example:

```
<template>
  <FormWrapper :on-form-valid="onFormValid">
    <template #content>
      ...
      <PasswordConfirmation
          :field-title="'Password'"
          :field-title-confirm="'Confirm password'"
          :placeholder="'Enter password'"
          :placeholder-confirm="'Repeat password'">
      </PasswordConfirmation>
      ...
    </template>
    ...
  </FormWrapper>
</template>
```

## 8. Built-in CSS

YoValidator offers default styling for form and field components. You can import it as the example below.

### 8.1 px based stylesheet

Example:

```
// in main.js
import "yo-validator/dist/css/styles.css";
```

### 8.2 rem based stylesheet

The "__styles.css__" uses "__px__" as basic unit. Sometimes you use "__rem__" to style your website. 
Then you can import the rem based stylesheet.

Example of importing rem based stylesheet:

```
// in main.js
import "yo-validator/dist/css/styles-rem.css";
```

### 8.3 Built-in CSS variables

#### Base unit for rem based styling

There is a handy CSS variable "__--yo-v-base-unit__" which is set to 16 by default.
In style-rem.css, all sizes are calculated by "__calc()__", e.g. "__calc(40rem / var(--yo-v-base-unit))__".

This calculation offers the flexibility for the CSS trick of setting HTML font size to 10px. 
To explain a little more, when you set HTML font size to 10px, 40px becomes 4rem. 
This is easier for your brain to calculate the rem value since "__any number / 10__" is way easier than "__the number / 16__". 
Therefore, when you follow this trick, you can just overwrite the "__--yo-v-base-unit__" from 16 to 10 in your main.css.

#### Overwrite other variables for your own goal

Besides the base unit, feel free to overwrite more styling to accomplish your own goal if you use built-in components.
Just open the CSS files in your IDE to take a look at the variables and styling inside. 

## 9. SingleFieldValidator component

The reason to put SingleFieldValidator at the end is that mostly you use form validation for forms.

Form fields are rarely used only by themselves. However, YoValidator still offers the possibility to validate your single fields.

SingleFieldValidator stands alone, it doesn't need to be wrapped in a FormValidator.

### 9.1 SingleFieldValidator props

| Supported props | Default value | Required | Supported values/type |
|:---------------:|:-------------:|:--------:|:---------------------:|
|    fieldName    |       -       |   true   |        String         |
|      rules      |       -       |   true   |        String         |
|  isCrossField   |     false     |  false   |        Boolean        |
|      mode       |       3       |  false   |        1, 2, 3        |
|    errorMode    |       1       |  false   |         1, 2          |
|      delay      |      10       |  false   |        Number         |
|       tag       |     span      |  false   |       HTML tag        |

As you can see in the table, SingleFieldValidator has exactly the same props as FieldValidator.

However, the "__mode__" is default to "__3 (ACTIVE)__" and "__errorMode__" is default to "__1 (ALL)__".

This is because FieldValidator can take the mode and errorMode from its form, SingleFieldValidator doesn't have a form so the values must be defined.

Furthermore, mode "__1 (SUBMIT)__" doesn't make sense any more here since there is no submit button to trigger the validation process for SingleFieldValidator.

### 9.2 SingleFieldValidator slot props

SingleFieldValidator has the same slot props as FieldValidator. Furthermore, SingleFieldValidator has status flags explained below.

#### isPristine, isDirty, isTouched, isUntouched, isValid, isInvalid

These are just common flags for field status.
* isPristine: true if the field's input or change event is not triggered
* isDirty: true if the field's input or change event is triggered
* isUntouched: true if the field's blur or change event is not triggered
* isTouched: true if the field's blur or change event is triggered
* isValid: true if the field valid
* isInvalid: true if the field is not invalid
