<template>
  <g-chart
    ref="chart"
    :data="data"
    :events="revenueEvents"
    :options="revenueProjectionsOptions"
    :type="chartType"
  />
</template>

<script>
import { GChart } from 'vue-google-charts';
import gchart from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/gchart';

export default {
  name: 'RevenueChart',
  components: { GChart },
  mixins: [gchart],
  props: {
    chartType: { type: String, required: true },
    data: Array,
    xAxisTitle: String,
  },
  data() {
    const vm = this;
    return {
      revenueEvents: {
        click(e) {
          if (/^(area|bar)/.test(e.targetID)) {
            vm.$emit('columnChartSelect', vm.getChartAreaColor(vm.$refs.chart.$el, e.x, e.y));
          }
        },
      },
    };
  },
  computed: {
    revenueProjectionsOptions() {
      return {
        title: this.xAxisTitle,
        titleTextStyle: {
          fontSize: 14,
        },
        isStacked: true,
        bar: { groupWidth: '30%' },
        legend: 'none',
        vAxis: {
          minValue: 0,
          format: '$#,###.##',
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
        pointSize: 4,
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
