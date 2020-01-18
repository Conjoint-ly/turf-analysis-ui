<template>
  <g-chart
    ref="chart"
    :data="data"
    :events="events"
    :options="options"
    :type="chartType"
  />
</template>

<script>
import { GChart } from 'vue-google-charts';
import gchart from '../mixins/gchart';

export default {
  name: 'MovementsInPreferenceShareChart',
  components: { GChart },
  mixins: [gchart],
  props: {
    chartType: { type: String, required: true },
    data: Array,
  },
  data() {
    return {
      events: {
        click: (e) => {
          if (/^(area|bar)/.test(e.targetID)) {
            this.$emit('column-chart-select', this.getChartAreaColor(this.$refs.chart.$el, e.x, e.y));
          }
        },
      },
    };
  },
  computed: {
    minPreferenceShare() {
      return this.data.map((arr, i) => (i !== 0 ? arr.map((v, i) => (i % 3 === 1 ? (v < 0 ? v : 0) : 0)).reduce((a, v) => a + v, 0) : 0)).reduce((a, v) => Math.min(v, a), 100);
    },
    maxPreferenceShare() {
      return this.data.map((arr, i) => (i !== 0 ? arr.map((v, i) => (i % 3 === 1 ? (v > 0 ? v : 0) : 0)).reduce((a, v) => a + v, 0) : 0)).reduce((a, v) => Math.max(v, a), 0);
    },
    options() {
      return {
        title: 'Movements in preference shares (vs. baseline)',
        titleTextStyle: {
          fontSize: 14,
        },
        isStacked: true,
        vAxis: {
          minValue: -100,
          maxValue: 100,
          format: '#\'%\'',
          viewWindow: {
            min: this.minPreferenceShare,
            max: this.maxPreferenceShare,
          },
          textStyle: {
            fontSize: 14,
          },
        },
        hAxis: {
          format: '$#,###.##',
          textStyle: {
            fontSize: 14,
          },
        },
        backgroundColor: { fill: 'transparent' },
        pointSize: 4,
        bar: { groupWidth: '30%' },
        legend: 'none',
        height: 400,
        chartArea: {
          top: '8%',
          height: '70%',
          left: '15%',
          width: '75%',
        },
      };
    },
  },
};
</script>

<style scoped></style>
