<script>
export default {
	functional: true,
	render(h, context) {
		let validation = context.props.validation,
			field = context.props.field;

		if (validation.isPassed(field))
			return h("i", {
				class: "form-control-feedback glyphicon glyphicon-ok"
			});

		if (validation.hasError(field))
			return h("i", {
				class: "form-control-feedback glyphicon glyphicon-remove"
			});

		return null;
	}
};
</script>