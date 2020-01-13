<template>
    <validation-wrapper :validation="validation" field="formula">
        <input :value="formula" @input="input" class="form-control"/>
    </validation-wrapper>
</template>

<script>
    import ValidationWrapper from "@/elements/validation/wrapper";
    import validators from "@/components/simulations/validators/formula";

    export default {
        name: "revenue-formula",
        props: ["formula"],
        components: {ValidationWrapper},
        methods: {
            input(formula) {
                this.$emit("input", formula);
            }
        },
        validators
    };
</script>

<style scoped></style>
