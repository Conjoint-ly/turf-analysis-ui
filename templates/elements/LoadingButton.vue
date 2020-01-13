<template functional>
    <button :class="[data.class, data.staticClass]" :loading="props.loading" :disabled="props.disabled || props.loading" v-on="listeners">
        <template v-if="!props.loading">
            <slot></slot>
        </template>
        <template v-else>
            <slot name="loading">
                <i class="far fa-spinner fa-spin" key="loading"></i> Loading...
            </slot>
        </template>
    </button>
</template>

<script>
    export default {
        
    }
</script>