<template>
    <button @click="onShowWorksheetList" class="btn btn-primary btn-xs" type="button" v-if="hiddenWorksheetList">
        <i class="far fa-eye"></i> Show other worksheets
    </button>
</template>

<script>
    export default {
        model: {
            prop: "hiddenWorksheetList",
            event: "show-worksheet-list"
        },
        name: "show-worksheet-list-button",
        props: ["hiddenWorksheetList"],

        methods: {
            onShowWorksheetList: function () {
                this.$emit("show-worksheet-list", false);
            }
        }
    };
</script>

<style scoped></style>
