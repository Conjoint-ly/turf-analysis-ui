<script>
export default {
  functional: true,
  render(h, context) {
    const { question } = context.props;
    const { label } = context.props;

    function icon() {
      const icons = {
        intro: 'fal fa-paragraph',
        multiple: 'cli-multiple',
        short: {
          any: 'cli-text',
          email: 'cli-email',
          number: 'cli-number',
          regexp: 'cli-regexp',
        },
        capture: {
          paragraph: 'cli-paragraph',
          camera: 'cli-webcam',
        },
        likert: 'cli-likert',
        starrating: 'cli-starrating',
        constantsum: 'cli-constantsum',
        gg: 'cli-gg',
        vw: 'cli-vw',
        randomisationblock: 'cli-randomisation',
        conjoint: 'far fa-cubes',
      };

      if (question.answerType) return icons[question.type][question.answerType];

      return icons[question.type];
    }

    return h('i', { class: [icon(), context.data.class], attrs: { title: label } });
  },
};
</script>
