<template>
  <div class="chartWithOverlay">
    <div ref="elasticityArea" class="elasticity-area elasticity-area-simulator" />
    <g-chart
      ref="chart"
      :data="data"
      :events="preferenceShareEvents"
      :options="preferenceShareOptions"
      :type="chartType"
    />
  </div>
</template>

<script>
import $ from 'jquery';
import { GChart } from 'vue-google-charts';
import copy from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/copy';
import format from '../utils/format';
import gchart from '../mixins/gchart';

export default {
  name: 'PreferenceShareChart',
  components: { GChart },
  mixins: [gchart, copy],
  props: {
    elasticityChart: { type: Boolean, required: true },
    elasticityChartVariableConcept: { type: Array, required: true },
    chartType: { type: String, required: true },
    data: Array,
    scenarios: Array,
  },
  data() {
    return {
      preferenceShareEvents: {
        select: () => {
          if (this.elasticityChart) {
            this.elasticityChartSelect();
          }
        },
        click: (e) => {
          if (/^(area|bar)/.test(e.targetID)) {
            this.$emit('columnChartSelect', this.getChartAreaColor(this.$refs.chart.$el, e.x, e.y));
          }
        },
        ready: () => {
          this.clearElasticArea();
        },
      },
      elasticityPoints: [],
    };
  },
  computed: {
    maxPreferenceShare() {
      return this.data.map(
        (arr, i) => (i !== 0 ? arr.map((v, i) => (i % 3 === 1 ? v : 0)).reduce((a, v) => a + v, 0) : 0),
      )
        .reduce((a, v) => Math.max(v, a), 0);
    },
    preferenceShareOptions() {
      return {
        title: 'Preference shares',
        titleTextStyle: {
          fontSize: 14,
        },
        isStacked: true,
        vAxis: {
          minValue: 0,
          format: "#'%'",
          viewWindow: {
            min: 0,
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
  methods: {
    elasticityChartSelect() {
      const chartObject = this.getChartObject();
      const selection = chartObject.getSelection()[0];

      // Reset
      if (!selection) {
        this.elasticityPoints = [];
        this.clearElasticArea();
        return false;
      }

      // Retrieve data
      const { row } = selection;
      const column = Math.floor(selection.column / 3);
      const scenarios = this.copy(this.scenarios);
      scenarios.sort((a, b) => a.price - b.price);
      const scenario = scenarios[row];
      const { price } = scenario;
      let adjustedPreferenceShare = null;
      let concept = null;
      if (scenario.concepts[column]) {
        adjustedPreferenceShare = scenario.concepts[column].adjustedPreferenceShare;
        concept = scenario.concepts[column];
      } else if (scenario.none) {
        adjustedPreferenceShare = scenario.none.adjustedPreferenceShare;
        concept = scenario.none;
      }

      // Construct point
      const point = JSON.stringify([adjustedPreferenceShare, price, concept.name.trim()]);

      // Check on the same point and remove the same point
      const pointIndex = this.elasticityPoints.indexOf(point);
      if (pointIndex !== -1) {
        this.elasticityPoints.splice(pointIndex, 1);
        this.clearElasticArea();
        return false;
      }

      this.elasticityPoints.push(point);

      // Remove first
      if (this.elasticityPoints.length > 2) {
        this.elasticityPoints.splice(0, 1);
      }

      // Wait a second point
      if (this.elasticityPoints.length === 1) {
        window.newNotifier({
          topic: 'elasticity',
          type: 'info',
          message:
                            'You have selected one point on the elasticity curve. Please select a second point to calculate price elasticity of demand.',
        });
        return true;
      }

      // Calculate
      const points = [JSON.parse(this.elasticityPoints[0]), JSON.parse(this.elasticityPoints[1])];
      const elasticValue = (points[0][0] - points[1][0])
                    / (points[0][0] + points[1][0])
                    / ((points[0][1] - points[1][1]) / (points[0][1] + points[1][1]));

      // Min Max prices
      const min = Math.min.apply(Math, [points[0][1], points[1][1]]);
      const minLabel = format.formatMoney(min, '$');
      const max = Math.max.apply(Math, [points[0][1], points[1][1]]);
      const maxLabel = format.formatMoney(max, '$');

      // Make conclusion
      let conclusion = `${concept ? `<b>${concept.name}</b></p><p>` : ''
      }Price elasticity of demand between <b>${
        minLabel
      }</b> and <b>${
        maxLabel
      }</b> is <b>${
        Math.round(elasticValue * 10) / 10
      }</b>.`;
      if (isNaN(elasticValue) || Math.abs(elasticValue) === Infinity || points[0][2] !== points[1][2]) {
        window.Notifier('elasticity', 'danger',
          'Elasticity cannot be calculated between these two points.');
        return false;
      }

      if (elasticValue === 0) {
        conclusion
                        += '</p><p>Price elasticity of demand is <b>zero</b> (i.e., changing price does not affect volume).';
      } else if (elasticValue < -1) {
        conclusion
                        += '</p><p>Demand is <b>elastic</b> (i.e., an increase in price by 1% leads to more than 1% drop in volume).';
      } else if (elasticValue < 0) {
        conclusion
                        += '</p><p>Demand is <b>inelastic</b> (i.e., an increase in price by 1% leads to less than 1% drop in volume).';
      } else {
        conclusion
                        += '</p><p>Price elasticity of demand is <b>positive</b> (i.e., the higher the price, the more they want to buy).';
      }

      this.fillElasticityArea(chartObject, min, max);

      // Here you can customize message text for other concepts
      if (this.elasticityChartVariableConcept[column] !== true) {
        window.Notifier('elasticity', 'danger',
          'Elasticity cannot be calculated between these two points.');
        return false;
      }

      window.Notifier('elasticity', 'success', conclusion);
    },
    fillElasticityArea(chartObject, min, max) {
      const cli = chartObject.getChartLayoutInterface();
      const left = Math.floor(cli.getXLocation(min));
      const right = Math.ceil(cli.getXLocation(max));
      const $elasticityArea = $(this.$refs.elasticityArea);
      $elasticityArea.show().css({ left: `${left}px`, width: `${right - left}px` });
    },
    clearElasticArea() {
      $(this.$refs.elasticityArea).hide();
      window.clearNotifierTopic('elasticity');
    },
  },
};
</script>

<style scoped></style>
