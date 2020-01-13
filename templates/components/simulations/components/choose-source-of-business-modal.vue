<template>
    <div aria-hidden="true" class="modal modal-lg-important fade" ref="modal" role="dialog" tabindex="-1"
         data-keyboard="false"
         data-backdrop="static"
    >
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" class="close" data-dismiss="modal" type="button">&times;</button>
                <h4 class="modal-title">Choose source of business scenarios</h4>
            </div>
            <div class="modal-body">
                <choose-source-of-business
                    :scenario="scenario"
                    :worksheets="worksheets"
                    @choose="onChooseSourceOfBusiness"
                    v-if="showModal"
                    ref="choose"
                ></choose-source-of-business>
            </div>
            <div class="modal-footer">
                <div class="pull-left">
                    <button @click="onClose" class="btn btn-default" data-dismiss="modal" type="button">Close</button>
                </div>
                <button @click="onChoose" class="btn btn-success" type="button">
                    <i class="far fa-check"></i> Choose
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import modal from "@/components/simulations/mixins/modal";
    import ChooseSourceOfBusiness from "@/components/simulations/components/choose-source-of-business";
    import {mapActions} from "vuex";

    export default {
        name: "choose-source-of-business-modal",
        components: {ChooseSourceOfBusiness},
        mixins: [modal],
        props: ["worksheets", "scenario"],
        data: function () {
            return {
                isMounted: false
            };
        },
        mounted() {
            this.isMounted = true;
        },
        computed: {},
        methods: {
            ...mapActions(["addSourceOfBusinessWorksheet"]),
            onChoose(e) {
                if (this.isMounted) {
                    this.$refs.choose && this.$refs.choose.onChoose(e);
                }
            },
            onChooseSourceOfBusiness({newWorksheetId, newScenario, baselineWorksheetId, baselineScenario}) {
                this.$emit("choose", {newWorksheetId, newScenario, baselineWorksheetId, baselineScenario});
            }
        }
    };
</script>

<style lang="scss" scoped></style>
