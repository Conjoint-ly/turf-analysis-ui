<template>
    <input
        :class="{ 'has-error dont-touch has-error-concept-name': validation.hasError() }"
        :name="name"
        :value="conceptName"
        @input="onInput"
        class="form-control"
        type="text"
        v-bind="{ validation }"
    />
</template>

<script>
    import copy from "../mixins/copy";
    import {mapGetters, mapMutations} from "vuex";
    import validators from "@/components/simulations/validators/concept-name";
    import {debounce} from "lodash";

    export default {
        name: "concept-name",
        template: "#concept-name",
        mixins: [copy],
        props: ["name", "concept", "conceptsNames", "conceptIndex"],
        computed: {
            ...mapGetters(["getConceptName"]),
            conceptName: {
                get: function () {
                    return this.getConceptName(this.concept);
                },
                set: function (value) {
                    this.setConceptName({concept: this.concept, name: value});
                }
            }
        },
        methods: {
            ...mapMutations({
                setConceptName: "SET_CONCEPT_NAME"
            }),
            onInput: debounce(
                function (e) {
                    this.conceptName = e.target.value;
                },
                500,
                {leading: true}
            )
        },
        validators: validators
    };
</script>

<style scoped></style>
