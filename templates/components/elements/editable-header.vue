<template functional>
    <div class="editable-header">
        <div class="editable-header-prepend">
            <slot name="prepend"></slot>
        </div>
        <div class="editable-header-prepend editable-header-prepend-last">
            <slot name="prepend-separate"></slot>
        </div>
        <span class="editable-header-append">
            <slot name="append"></slot>
        </span>
        <div class="editable-header-container">
            <slot></slot>
        </div>
    </div>
</template>