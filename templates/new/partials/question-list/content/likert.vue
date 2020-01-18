<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.question, props.parameters)" />
    </p>

    <div v-if="props.question.text" v-html="props.question.text" />
    <em v-else class="text-muted">{{ props.placeholders.text }}</em>

    <div>
      <em class="text-muted">Labelled from</em>
      {{ props.question.minLabel }} ({{ props.question.minValue }})
      <em class="text-muted">to</em>
      {{ props.question.maxLabel }} ({{ props.question.maxValue }})
    </div>
  </div>
</template>

<script>
export default {
  getSettingString(question, parameters) {
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
