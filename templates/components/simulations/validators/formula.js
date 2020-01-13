import {Validator} from "simple-vue-validator";
import {Parser} from "expr-eval";

export default {
    formula(value) {
        return Validator.value(value).required().custom(() => {
            try {
                Parser.evaluate(value, {price: 2.176, share: 5.391}); // fake context
            } catch (e) {
                return "Can't be calculated.";
            }
        });
    }
};
