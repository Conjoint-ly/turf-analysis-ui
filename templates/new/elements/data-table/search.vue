<template functional>
  <label class="data-table-label">
    Search
    <input class="form-control" @input="listeners['setSearch']( $event.target.value )">
  </label>
</template>
