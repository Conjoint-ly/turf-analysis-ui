<template>
    <label class="bootstrapswitch-inner">
        <input type="checkbox"
               :name="name"
               :value="value"
               @change.prevent="$emit('input', $event.target.checked ? 1 : 0)"
               :checked="value === 1"
               :disabled="disabled"
        />
        <span></span>
    </label>
</template>

<script>
    export default {
        'name': 'checkbox',
        props: {
            name: {type: String, required: true},
            value: {type: Number, required: true},
            disabled: {type: Boolean, default: false}
        },
    }
</script>

<style scoped>
    label.bootstrapswitch-inner > span::before {
        padding: 2px 6px !important;
    }
</style>