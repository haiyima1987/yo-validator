export default {
  names: {
    username: 'username',
    email: 'email',
    profile: 'profile image',
  },
  messages: {
    default: 'Invalid field',
    required: {
      default: 'Your {fieldName} is required.',
      username: 'Your must fill in {fieldName}.',
      email: 'Please fill in your {fieldName}.'
    },
    alpha: {
      default: 'Your {fieldName} can only contain alphabets.'
    },
    alphaNumeric: {
      default: 'Your {fieldName} can only contain alphabets and numbers.'
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
    max: {
      default: 'Your {fieldName} cannot be bigger than {max}.'
    },
    min: {
      default: 'Your {fieldName} cannot be smaller than {min}.'
    },
    maxLength: {
      default: 'Your {fieldName} cannot be longer than {maxLength} characters.'
    },
    minLength: {
      default: 'Your {fieldName} cannot be shorter than {minLength} characters.'
    },
    maxSize: {
      default: 'Your {fieldName} cannot be larger than {maxSize}KB.'
    },
    minSize: {
      default: 'Your {fieldName} cannot be smaller than {minSize}KB.'
    },
    same: {
      default: 'Values have to be the same.'
    },
    diff: {
      default: 'Values have to be different.'
    }
  }
}
