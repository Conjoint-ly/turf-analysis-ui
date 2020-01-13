export default {
    methods: {
        copy: function (obj, withoutId) {
            return this.$store.getters.getCopy(obj, withoutId);
        }
    }
};
