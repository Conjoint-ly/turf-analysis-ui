<template>
    <div class="modal fade modal-lg-important" data-backdrop="static" data-keyboard="false" data-modal-overflow="true"
         tabindex="-1" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button @click="close" type="button" class="close">&times;</button>
                <h4>
                    <editable-header>
                        <template #prepend>
                            <span v-text="title"></span>
                        </template>
                        <template #prepend-separate>:</template>
                        <template>
                            <editable :value="textShortLocal"
                                @update="textShortLocal = $event"
                                title="Click to rename this point"
                                      :disabled="!isEditTextsAvailable || !canEditUser"
                            ></editable>
                        </template>
                    </editable-header>
                </h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input id="on" v-model="onLocal" class="bootstrapswitch" type="checkbox">
                    <label for="on" class="bootstrapswitch-label">Add fancy formatting and pictures to claim
                        name</label>
                </div>
                <div v-show="onLocal">
                    <validation-wrapper
                            field="textLocal"
                            :validation="validation"
                    >
                        <froala-editor
                                v-model="textLocal"
                                :froalaConfig="froalaConfig"
                        ></froala-editor>
                    </validation-wrapper>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" @click="close">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Editable from '../elements/editable'
    import EditableHeader from '../elements/editable-header'
    import FroalaEditor from '../elements/froala-editor'
    import ValidationWrapper from '../elements/validation-wrapper'
    import SimpleVueValidation from 'simple-vue-validator'

    const Validator = SimpleVueValidation.Validator;

    export default {
        name: 'format-modal',
        components: {Editable, EditableHeader, FroalaEditor, ValidationWrapper},
        props: {
            title: {type: String, required: true},
            textShort: {type: String, required: true},
            requiredTextShort: {type: Boolean, required: false},
            textOn: {type: Number, required: true},
            text: {type: String, required: true},
        },
        validators: {
            'textShortLocal'(value) {
                if (this.requiredTextShort) {
                    return Validator.value(value).required();
                }
            },
            'textLocal'(value) {
                if (this.onLocal) {
                    return Validator.value(value).required();
                }
            },
        },
        computed: {
            ...mapState([
                'froalaConfig',
                'isEditTextsAvailable',
                'canEditUser'
            ]),
        },
        data() {
            return {
                textShortLocal: this.textShort,
                onLocal: this.textOn,
                textLocal: this.text,
            };
        },
        methods: {
            async close() {
                if (await this.$validate()) {
                    this.$emit('close', {
                        text_short: this.textShortLocal,
                        text_on: this.onLocal ? 1 : 0,
                        text: this.onLocal ? this.textLocal : '',
                    });
                }
            }
        },
        }
</script>

<style scoped>
    .modal-content {
        box-shadow: none;
        border: 0;
    }
</style>
