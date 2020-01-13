<template>
    <select>
        <slot></slot>
    </select>
</template>

<script>
import $ from 'jquery';

export default {
    props: ['options', 'value'],
    mounted() {
        var vm = this;
        $(this.$el)
            .select2({
                escapeMarkup: function(markup) {
                    return markup;
                },
                templateResult: function(data) {
                    return data.html;
                },
                templateSelection: function(data) {
                    return data.text;
                }
            })
            .val(this.value)
            .trigger('change')
            .on('change', function () {
                vm.$emit('input', this.value)
            });
    },
    watch: {
        value(value) {
            $(this.$el)
                .val(value);
        },
        options() {}
    },
    destroyed() {
        $(this.$el).off().select2('destroy');
    }
};
</script>