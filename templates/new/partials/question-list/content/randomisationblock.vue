<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.question)" />
    </p>
  </div>
</template>

<script>
export default {
  getSettingString(question) {
    const settings = [];

    if (question.randomisationBlockMaxNumber) {
      settings.push(
        `Display maximum ${question.randomisationBlockMaxNumber} ${question.randomisationBlockMaxNumber > 1 ? 'questions' : 'question'} per respondent`,
      );
    }

    if (settings.length) return `(${settings.join('; ')})`;

    return null;
  },
};
</script>
