<template>
    <select class="form-control" :name="name" :disabled="disabled" :value="value" @input="$emit('input', $event.target.value)">
        <slot></slot>
    </select>
</template>

<script>
    const config = {
        escapeMarkup(markup) {
            return markup;
        },
        templateResult(data) {
            return data.text;
        },
        templateSelection(data) {
            return data.text;
        }
    };
    export default {
        name: 'vue-select',
        props: {
            value: {type: String, required: true},
            name: {type: String, default: ''},
            disabled: {type: Boolean, default: false},
            searchable: {type: Boolean, default: false},
        },
        mounted() {
            $(this.$el)
                .select2(config)
                .val(this.value)
                .trigger('change')
                .on('change', (e) => {
                    this.$emit('input', e.target.value);
                })
        },
        watch: {
            value() {
                $(this.$el).trigger('change');
            }
        },
        destroyed() {
            $(this.$el).off().select2('destroy');
        }
    }
</script>

<style scoped>
</style>
