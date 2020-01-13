export default {
    methods: {
        getChartObject: function () {
            return this.$refs.chart.chartObject;
        },
        getChartAreaColor: function (chart, x, y) {
            const coordinates = chart.getBoundingClientRect();
            const offsetX = coordinates.x ? coordinates.x : coordinates.left;
            const offsetY = coordinates.y ? coordinates.y : coordinates.top;

            const el = document.elementFromPoint(x + offsetX, y + offsetY);
            return el.hasAttribute("fill") ? el.getAttribute("fill") : null;
        }
    }
};
