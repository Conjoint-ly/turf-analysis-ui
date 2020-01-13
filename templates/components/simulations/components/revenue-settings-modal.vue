<template>
    <div
        aria-hidden="true"
        class="modal modal-lg-important fade"
        data-backdrop="static"
        data-keyboard="false"
        ref="modal"
        role="dialog"
        tabindex="-1"
    >
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" class="close" data-dismiss="modal" type="button">&times;</button>
                <h4 class="modal-title">
                    <editable
                        :placeholder="calculationNamePlaceholder"
                        :value="title"
                        @update="title = $event"
                    ></editable>
                </h4>
            </div>
            <div class="modal-body">
                <div>
                    <div class="form-group">
                        <label for="revenueTitle">Revenue's graph title</label>
                        <input class="form-control" id="revenueTitle" type="text" v-model="xAxisTitle"/>
                    </div>
                    <div class="form-group">
                        <table class="table table-formulas">
                            <tbody>
                            <tr :key="concept" v-for="(formula, concept) in formulas">
                                <td>
                                    <label>{{ concept }}</label>
                                </td>
                                <td>
                                    <revenue-formula
                                        :formula="formula"
                                        @input="updateFormula(concept, $event)"
                                    ></revenue-formula>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="pull-left">
                    <button @click="onClose" class="btn btn-default" data-dismiss="modal" type="button">Close</button>
                </div>
                <button @click="onSave" class="btn btn-success" type="button">
                    <i class="far fa-check"></i> Apply
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Editable from "@/elements/editable";
    import modal from "@/components/simulations/mixins/modal";
    import {clone} from "lodash";
    import RevenueFormula from "@/components/simulations/components/revenue-formula";
    import getValidators from "@/mixins/get-validators.js";

    export default {
        name: "revenue-settings-modal",
        components: {RevenueFormula, Editable},
        mixins: [modal, getValidators],
        props: ["revenue", "concepts", "calculationNamePlaceholder"],
        data: function () {
            return {
                title: this.revenue.title,
                xAxisTitle: this.revenue.xAxisTitle,
                formulas: clone(this.revenue.formulas)
            };
        },
        methods: {
            updateFormula(concept, e) {
                this.formulas[concept] = e.target.value;
            },
            onSave() {
                const vm = this;
                this.validate().then(valid => {
                    if (!valid.includes(false))
                        vm.$emit("save", {
                            isNew: !vm.revenue.id,
                            revenue: vm.revenue,
                            title: vm.title,
                            xAxisTitle: vm.xAxisTitle,
                            formulas: clone(vm.formulas)
                        });
                });
            },
            validate() {
                return Promise.all(this.getValidators().map(validate => validate()));
            }
        },
        watch: {
            showModal() {
                this.title = this.revenue.title;
                this.xAxisTitle = this.revenue.xAxisTitle;
                this.formulas = clone(this.revenue.formulas);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .table-formulas {
        > tbody > tr > td {
            &:first-child {
                width: 1px;
                padding-right: 10px;
                max-width: 200px;
                vertical-align: middle;

                label {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

            padding: 0 0 5px;
            border: none;
        }
    }
</style>
