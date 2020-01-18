<script>
export default {
  functional: true,
  render(h, context) {
    const { validation } = context.props;
    const { field } = context.props;

    if (validation.isPassed(field)) {
      return h('i', {
        class: 'form-control-feedback glyphicon glyphicon-ok',
      });
    }

    if (validation.hasError(field)) {
      return h('i', {
        class: 'form-control-feedback glyphicon glyphicon-remove',
      });
    }

    return null;
  },
};
</script>
