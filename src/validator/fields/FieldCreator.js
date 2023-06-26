import {INDICATOR_CROSS_FIELD} from "../constants";
import CrossField from "../fields/CrossField";
import PairField from "../fields/PairField";
import BaseField from "../fields/BaseField";
import SingleField from "../fields/SingleField";
import SinglePairField from "../fields/SinglePairField";
import SingleCrossField from "../fields/SingleCrossField";

class FieldCreator {
  static getInstance() {
    if (!this.instance) {
      this.instance = new FieldCreator();
    }
    return this.instance;
  }

  createField({id, formId, fieldName, rules, isCrossField, delay, errorMode, mode, formData, setFormData}) {
    let field;
    if (!formId) {
      field = this.createSingleField({
        id,
        fieldName,
        rules,
        isCrossField,
        delay,
        errorMode,
        mode,
        formData,
        setFormData
      });
    } else {
      field = this.createFormField({
        id,
        formId,
        fieldName,
        rules,
        isCrossField,
        delay,
        errorMode,
        mode,
        formData,
        setFormData
      })
    }
    return field;
  }

  createFormField({id, formId, fieldName, rules, isCrossField, delay, errorMode, mode, formData, setFormData}) {
    let field;
    if (rules.includes(INDICATOR_CROSS_FIELD)) {
      field = new CrossField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    } else if (isCrossField) {
      field = new PairField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    } else {
      field = new BaseField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    }
    return field;
  }

  createSingleField({id, formId, fieldName, rules, isCrossField, delay, errorMode, mode, formData, setFormData}) {
    let field;
    if (rules.includes(INDICATOR_CROSS_FIELD)) {
      field = new SingleCrossField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    } else if (isCrossField) {
      field = new SinglePairField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    } else {
      field = new SingleField({
        id,
        formId,
        fieldName,
        rules,
        mode,
        errorMode,
        delay,
        formData,
        setFormData
      });
    }
    return field;
  }
}

export default FieldCreator.getInstance();
