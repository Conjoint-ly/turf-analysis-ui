import {Validator} from "simple-vue-validator";

export default {
    attributeValue(value) {
        const vm = this;
        const required = Validator.value(value).required();
        if (vm.isNumberPrice) {
            return required.between(vm.priceObject.min, vm.priceObject.max);
        }
        return required.in(vm.applicabilityLevels.map(l => l.value));
    }
};
