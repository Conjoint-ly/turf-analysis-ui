<template functional>
  <div>
    <p class="text-muted mb-025">
      <em v-text="$options.getSettingString(props.question, props.parameters)" />
    </p>

    <!-- Qualifying question -->
    <div v-if="props.parameters.qualifying">
      <div v-if="props.parameters.qualifying_text" v-html="props.parameters.qualifying_text" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>

      <div>
        <em class="text-muted">Qualifying answer buttons labelled as </em>
        {{ props.parameters.qualifying_yes }}
        <em class="text-muted">(Yes) and </em>
        {{ props.parameters.qualifying_no }}
        <em class="text-muted">(No)</em>
      </div>

      <hr class="my-1">
    </div>

    <!-- Main quesiton -->
    <div v-if="props.parameters.title" v-html="props.parameters.title" />
    <p v-else>
      <em class="text-muted">{{ props.placeholders.parameters[props.question.type].field_title_default }}</em>
    </p>

    <div class="mb-1">
      <em class="text-muted">Too cheap question text is:</em>
      <div v-if="props.parameters.too_low" v-html="props.parameters.too_low" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>
    </div>

    <div class="mb-1">
      <em class="text-muted">Good value price question text is:</em>
      <div v-if="props.parameters.cheap" v-html="props.parameters.cheap" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>
    </div>

    <div class="mb-1">
      <em class="text-muted">Expensive price question text is:</em>
      <div v-if="props.parameters.expensive" v-html="props.parameters.expensive" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>
    </div>

    <div class="mb-1">
      <em class="text-muted">Too expensive price question text is:</em>
      <div v-if="props.parameters.too_high" v-html="props.parameters.too_high" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>
    </div>

    <div>
      <em class="text-muted">Range of possible prices from </em>
      {{ props.parameters.min_price }}
      <em class="text-muted"> to </em>
      {{ props.parameters.max_price }}
    </div>

    <!-- NMS extension -->
    <div v-if="props.parameters.nms" class="mb-025">
      <hr class="my-1">

      <div v-if="props.parameters.nms_text" class="mb-1" v-html="props.parameters.nms_text" />
      <p v-else>
        <em class="text-muted">{{ props.placeholders.text }}</em>
      </p>

      <div>
        <em class="text-muted">NMS answer labelled from </em>
        {{ props.parameters.nms_min_label }}
        <em class="text-muted">(Unlikely) to </em>
        {{ props.parameters.nms_max_label }}
        <em class="text-muted">(Likely)</em>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  getSettingString(question, parameters) {
    const settings = [];

    if (parameters.qualifying) settings.push('With qualifying question');

    if (parameters.nms) settings.push('With Newton, Miller and Smith’s Extension');

    if (settings.length) return `(${settings.join('; ')})`;

    return null;
  },
};
</script>
