<template functional>
  <div>
    Showing {{ (props.currentPage - 1) * props.pageSize + 1 }}
    to {{ props.currentPage * props.pageSize >= props.showingItems ? props.showingItems : props.currentPage *
      props.pageSize }}
    of {{ props.showingItems }} entries
    <span
      v-show="props.showingItems != props.totalItems"
    >(filtered from {{ props.totalItems }} total entries)</span>
  </div>
</template>
