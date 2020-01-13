<template>
    <div class="input-group">
        <input
            :disabled="disabled"
            :value="formattedValue"
            @input="input"
            class="form-control"
            max="100"
            min="0"
            type="number"
        />
        <span class="input-group-addon">%</span>
    </div>
</template>

<script>
    export default {
        name: "input-number-percentage",
        props: ["value", "disabled"],
        computed: {
            formattedValue: function () {
                return Math.round(this.value * 10000) / 100;
            }
        },
        methods: {
            input: function (e) {
                this.$emit("input", e.target.value / 100);
            }
        }
    };
</script>

<style scoped></style>
