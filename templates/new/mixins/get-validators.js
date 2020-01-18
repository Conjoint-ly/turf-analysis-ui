export default {
  methods: {
    getValidators() {
      const getValidators = (component) => [].concat(
        ...[
          component.validation
            ? component.validate
              ? component.validate
              : component.$validate
            : null,
          ...component.$children.map((child) => getValidators(child)),
        ],
      );

      return getValidators(this).filter(Boolean);
    },
  },
};
