import {Validator} from "simple-vue-validator";

export default {
    conceptName(value) {
        const vm = this;
        return Validator.value(value).required().notIn(vm.conceptsNames.filter((name, index) => index !== vm.conceptIndex));
    }
};
