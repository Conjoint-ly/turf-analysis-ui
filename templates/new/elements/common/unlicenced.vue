<template>
  <span
    class="dotted"
    data-toggle="tooltip"
    title="These responses have been collected, but they are not yet included in analysis because no Conjoint.ly licence has been purchased or applied to this experiment."
  >unlicenced</span>
</template>

<style lang="scss">
    .tooltip {

        &-arrow {
            display: none;
        }

        &-inner {
            max-width: 400px;
            border-color: #ddd;
            background: #efefef;
            color: #333;
            box-shadow: 0 0 5px #aaa;
        }
    }
</style>
