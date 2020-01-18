<template functional>
  <li>
    <em v-if="props.item.type !== 'standard'">
      {{ $options.getExtraTypeString(props.item) }}:
    </em>

    <template v-if="props.item.text">
      {{ props.item.text }}
    </template>
    <em v-else class="text-muted">{{ props.placeholders.items[props.question.type][props.item.type].text }} </em>

    <span
      v-if="props.item.action !== 'none'"
      :class="$options.getActionClass(props.item)"
      v-text="$options.getActionString(props.item)"
    />

    <div v-if="props.item.parameters.fancyNameOn" v-html="props.item.parameters.fancyName" />
  </li>
</template>

<style scoped>
    .text-screenout {
        color: #c53030;
    }

    .text-redirect {
        color: #d69e2e;
    }

    .text-quota {
        color: #3182ce;
    }
</style>

<script>
export default {
  getActionString(item) {
    const actions = [];

    if (item.action === 'screenout') actions.push('Screenout');

    if (item.action === 'screenout-if-not-chosen') actions.push('Screenout if not chosen');

    if (item.action === 'redirect') {
      actions.push(`Redirect to ${item.redirect.url}`);

      if (item.redirect.all_vars) actions.push('Append all GET variables');
    }

    if (item.action === 'redirect-if-not-chosen') {
      actions.push(`Redirect if not chosen to ${item.redirect.url}`);

      if (item.redirect.all_vars) actions.push('Append all GET variables');
    }

    if (item.action === 'quota') {
      actions.push(`Redirect if quota for answers met to ${item.redirect.url}`);

      actions.push(`Quota size is ${item.parameters.quotaSize}`);

      if (item.redirect.all_vars) actions.push('Append all GET variables');
    }

    if (actions.length) return `(${actions.join('; ')})`;

    return null;
  },
  getActionClass(item) {
    if (item.action.indexOf('screenout') > -1) return 'text-screenout';

    if (item.action.indexOf('redirect') > -1) return 'text-redirect';

    if (item.action.indexOf('quota') > -1) return 'text-quota';
  },
  getExtraTypeString(item) {
    if (item.type === 'none') return 'None of above';

    return 'Other';
  },
};
</script>
