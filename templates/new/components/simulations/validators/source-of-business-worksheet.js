import { Validator } from 'simple-vue-validator';

export default {
  newWorksheet(value) {
    return Validator.value(value).required();
  },
  baselineWorksheet(value) {
    return Validator.value(value).required();
  },
  newScenario(value) {
    return Validator.value(value).required();
  },
  baselineScenario(value) {
    return Validator.value(value).required();
  },
};
