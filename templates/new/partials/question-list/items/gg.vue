<template functional>
  <li>
    <template v-if="props.item.text">
      {{ props.item.text }} ({{ props.item.value }})
    </template>
    <em v-else class="text-muted">
      {{ props.placeholders.items[props.question.type].text }}
    </em>
  </li>
</template>
