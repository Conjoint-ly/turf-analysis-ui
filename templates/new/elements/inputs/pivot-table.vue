<template>
  <div ref="output" />
</template>

<script>
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable.js';
import 'pivottable';
import 'pivottable/dist/pivot.min.css';
import 'pivottable/dist/gchart_renderers.js';

$(() => {
  window.google.load('visualization', '1', {
    packages: ['corechart'],
  });
});

export default {
  props: {
    /**
             * Входной массив данных
             */
    items: {
      type: Array,
      required: true,
    },
    /**
             * Объект с настройками
             */
    settings: {
      type: Object,
      required: true,
    },
    /**
             * Указатель является ли компонент предопределенным или настраиваемым
             */
    predefined: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      defaults: {
        aggregators: $.pivotUtilities.aggregators,
        controls: this.settings.controls,
        derivers: $.pivotUtilities.derivers,
        hiddenAttributes: this.settings.hiddenAttributes,
        labels: this.settings.labels,
        onRefresh: this.refreshOptions,
        renderers: $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers),
        rendererOptions: this.settings.rendererOptions,
      },
      options: {},
    };
  },
  mounted() {
    this.refresh();
    this.$bus.on('pivot-table@refresh', this.refresh);
  },
  activated() {
    this.refresh();
  },
  methods: {
    initOptions() {
      const options = {
        ...this.defaults,
        ...this.settings.options,
      };

      if (this.predefined) {
        options.aggregator = options.aggregator ? $.pivotUtilities.aggregatorTemplates[options.aggregator]()(options.aggregatorValues) : options.aggregator;
        options.renderer = $.pivotUtilities.renderers[options.renderer];
      }

      this.options = options;
    },
    refresh() {
      this.initOptions();

      if (this.predefined) {
        this.pivot();
      } else {
        this.pivotUI();
      }
    },
    refreshOptions(config) {
      const options = { ...config };

      [
        'aggregators',
        'controls',
        'dataClass',
        'derivers',
        'filter',
        'hiddenAttributes',
        'renderers',
        'labels',
        'onRefresh',
        'rendererOptions',
      ].forEach((key) => (delete options[key]));

      /**
                 * Событие при изменении конфигурации
                 * @type {object}
                 */
      this.$emit('optionsSet', options);
    },
    pivot() {
      $(this.$refs.output).pivot(this.items, this.options);
    },
    pivotUI() {
      $(this.$refs.output).pivotUI(this.items, this.options, true);
    },
  },
};
</script>
