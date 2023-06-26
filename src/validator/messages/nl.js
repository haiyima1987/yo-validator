export default {
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
    alpha: {
      default: 'Uw {fieldName} mag alleen alfabetten bevatten.'
    },
    alphaNumeric: {
      default: 'Uw {fieldName} mag alleen letters en cijfers bevatten.'
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
    max: {
      default: 'Uw {fieldName} mag niet groter zijn dan {max}.'
    },
    min: {
      default: 'Uw {fieldName} mag niet kleiner zijn dan {min}.'
    },
    maxLength: {
      default: 'Uw {fieldName} mag niet langer zijn dan {maxLength} tekens.'
    },
    minLength: {
      default: 'Uw {fieldName} mag niet korter zijn dan {minLength} tekens.'
    },
    maxSize: {
      default: 'Uw {fieldName} mag niet groter zijn dan {maxSize}KB.'
    },
    minSize: {
      default: 'Uw {fieldName} mag niet kleiner zijn dan {minSize}KB.'
    },
    confirm: {
      default: 'Waarden moeten gelijk zijn.'
    },
    diff: {
      default: 'Waarden moeten anders zijn.'
    }
  }
}
