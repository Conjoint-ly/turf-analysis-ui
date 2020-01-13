<template>
    <li :class="{ 'worksheet-tab': true, active: isActive }" @mouseleave="hover = false" @mouseover="hover = true">
        <a @click.stop.prevent="onSelectWorksheet" href="#">
            <flexible-header>
                <template #prepend>
                    <i class="far fa-spinner fa-spin fa-fw" v-show="processing"></i>
                </template>
                <template #default>
                    <span>{{ worksheet.name || worksheetNamePlaceholder }}</span>
                </template>
                <template #append>
                    <div class="btn-group btn-group-xs header-btn-group" v-show="hover">
                        <button
                            @click.stop.prevent.capture="onCopyWorksheet"
                            class="btn btn-default btn-xs"
                            title="Copy worksheet"
                            type="button"
                        >
                            <i class="far fa-clone fa-fw"></i>
                        </button>
                        <button
                            @click.stop.prevent.capture="onDeleteWorksheet"
                            class="btn btn-default btn-xs"
                            title="Delete worksheet"
                            type="button"
                            v-if="canBeDeleted"
                        >
                            <i class="far fa-trash fa-fw"></i>
                        </button>
                        <button
                            class="worksheet-drag-handle btn btn-default btn-xs"
                            title="Drag and drop to re-order worksheets"
                            type="button"
                            v-if="worksheetsCount > 1"
                        >
                            <i class="far fa-arrows fa-fw"></i>
                        </button>
                    </div>
                </template>
            </flexible-header>
        </a>
    </li>
</template>

<script>
    import FlexibleHeader from "@/elements/flexible-header";
    import {SOURCE_OF_BUSINESS, WHAT_IF} from "@/components/simulations/worksheet-types";

    export default {
        name: "worksheet-header",
        components: {FlexibleHeader},
        props: [
            "worksheet",
            "worksheetIndex",
            "isActive",
            "worksheetsCount",
            "whatIfWorksheetsCount",
            "processing",
            "worksheetNamePlaceholder"
        ],
        data: function () {
            return {
                hover: false
            };
        },
        computed: {
            canBeDeleted() {
                return (
                    (this.worksheet.type === WHAT_IF && this.whatIfWorksheetsCount > 1) ||
                    this.worksheet.type === SOURCE_OF_BUSINESS
                );
            }
        },
        methods: {
            onSelectWorksheet() {
                this.$emit("select-worksheet", this.worksheetIndex);
            },
            onCopyWorksheet() {
                this.$emit("copy-worksheet", this.worksheetIndex);
            },
            onDeleteWorksheet() {
                this.$emit("delete-worksheet", this.worksheetIndex);
            }
        }
    };
</script>

<style scoped>
    .header-btn-group {
        display: flex;
    }
</style>
