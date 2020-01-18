<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.question, props.items, props.parameters)" />
    </p>

    <div v-if="props.question.text" v-html="props.question.text" />
    <em v-else class="text-muted">{{ props.placeholders.text }}</em>

    <div>
      <em class="text-muted">Total sum is</em>
      {{ props.question.sum }}
      <em class="text-muted">labelled as</em>
      {{ props.question.sumLabel }}
    </div>
  </div>
</template>

<script>
export default {
  getSettingString(question, items, parameters) {
    const settings = [];

    if (question.required) settings.push('Required');

    if (parameters.delay) {
      settings.push(
        `Force respondents to stay on this question for ${parameters.delay} ${parameters.delay > 1 ? 'seconds' : 'second'}`,
      );
    }

    if (settings.length) return `(${settings.join('; ')})`;

    return null;
  },
};
</script>
