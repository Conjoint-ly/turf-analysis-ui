<template functional>
    <div class="panel panel-default">
        <div class="panel-heading">
            <slot name="panel-header"></slot>
        </div>
        <div v-show="props.showBlock" class="panel-body">
            <slot name="panel-body"></slot>
        </div>
    </div>
</template>