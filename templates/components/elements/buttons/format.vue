<template functional>
    <button type="button"
            :title="props.title"
            :class="`btn ${props.btnClass !== undefined ? props.btnClass : 'btn-default'} ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`"
            @click="listeners['click']">
        <span><i class="far fa-image fa-fw"></i> </span>
    </button>
</template>