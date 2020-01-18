<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.question, props.parameters)" />
    </p>

    <div v-if="props.question.text" v-html="props.question.text" />
    <em v-else class="text-muted">{{ props.placeholders.text }}</em>
  </div>
</template>

<script>
export default {
  getSettingString(question, parameters) {
    const settings = [];

    if (question.required) settings.push('Required');

    if (question.moreThanOne) settings.push('Allow more than one response');

    if (question.randomize) settings.push('Randomise order of options');

    if (parameters.columns) settings.push(`Place options in ${parameters.columns} ${parameters.columns > 1 ? 'columns' : 'column'}`);

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
