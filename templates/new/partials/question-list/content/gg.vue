<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.parameters)" />
    </p>

    <div v-if="props.parameters.qualifying">
      <div v-if="props.parameters.qualifying_text" v-html="props.parameters.qualifying_text" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>

      <div>
        <em class="text-muted">Qualifying answer buttons labelled as </em>
        <template v-if="props.parameters.qualifying_yes">
          {{ props.parameters.qualifying_yes }}
          <em class="text-muted">(Yes)</em>
        </template>
        <em v-else>{{ props.placeholders.text }}</em>

        <em class="text-muted"> and </em>
        <template v-if="props.parameters.qualifying_no">
          {{ props.parameters.qualifying_no }}
          <em class="text-muted">(No)</em>
        </template>
        <em v-else>{{ props.placeholders.text }}</em>
      </div>

      <hr class="my-1">
    </div>

    <div v-if="props.question.text" v-html="props.question.text" />
    <p v-else>
      <em class="text-muted">{{ props.placeholders.text }}</em>
    </p>

    <div class="mb-025">
      <em class="text-muted">Answer buttons labelled as </em>
      <template v-if="props.parameters.yes">
        {{ props.parameters.yes }}
        <em class="text-muted">(Yes)</em>
      </template>
      <em v-else>{{ props.placeholders.text }}</em>

      <em class="text-muted"> and </em>
      <template v-if="props.parameters.no">
        {{ props.parameters.no }}
        <em class="text-muted">(No)</em>
      </template>
      <em v-else>{{ props.placeholders.text }}</em>
    </div>
  </div>
</template>

<script>
export default {
  getSettingString(parameters) {
    const settings = [];

    if (parameters.qualifying) settings.push('With qualifying question');

    if (settings.length) return `(${settings.join('; ')})`;

    return null;
  },
};
</script>
