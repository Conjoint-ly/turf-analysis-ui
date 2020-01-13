<template functional>
    <div>
        <span class="pull-left">
            <button class="btn btn-default" @click="listeners.prev">
                <i class="fas fa-angle-left" />
                Previous
            </button>
            <button class="btn btn-default" @click="listeners.next">
                Next
                <i class="fas fa-angle-right" />
            </button>
        </span>

        <button class="btn btn-default" @click="listeners.cancel">
            Close
        </button>
    </div>
</template>
