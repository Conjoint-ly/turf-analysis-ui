<template>
  <table
    ref="table"
    class="scrolling"
    :class="{ scrolly: scrollVertical, scrollx: scrollHorizontal, 'freeze-first-column': freezeFirstColumn }"
    :style="tableStyle"
  >
    <thead
      ref="thead"
      name="thead"
      :class="{ scrollsync: syncHeaderScroll }"
      :style="syncHeaderScroll && scrollVertical ? stubScrollbarStyle : ''"
      @dragenter="onDragEnterHeader"
      @dragover.prevent="onDragOverHeader"
      @drop="onDropHeader"
    >
      <slot name="thead" />
    </thead>
    <tbody
      ref="tbody"
      name="tbody"
      @scroll.passive="updateSyncedScroll"
    >
      <slot name="tbody" />
    </tbody>
    <tfoot
      v-if="includeFooter"
      ref="tfoot"
      name="tfoot"
      :class="{ scrollsync: syncFooterScroll }"
      :style="syncFooterScroll && scrollVertical ? stubScrollbarStyle : ''"
    >
      <slot name="tfoot" />
    </tfoot>
  </table>
</template>
<script>
export default {
  name: 'VueScrollingTable',
  props: {
    deadAreaColor: { type: String, required: false, default: '#fff' },
    includeFooter: { type: Boolean, required: false, default: false },
    syncHeaderScroll: { type: Boolean, required: false, default: true },
    syncFooterScroll: { type: Boolean, required: false, default: true },
    scrollHorizontal: { type: Boolean, required: false, default: true },
    scrollVertical: { type: Boolean, required: false, default: true },
    freezeFirstColumn: { type: Boolean, required: false, default: false },
  },
  computed: {
    tableStyle() {
      return `background-color: ${this.deadAreaColor};`;
    },
    stubScrollbarStyle() {
      return `background-color: ${this.deadAreaColor};
				scrollbar-base-color: ${this.deadAreaColor};
				scrollbar-face-color: ${this.deadAreaColor};
				scrollbar-highlight-color: ${this.deadAreaColor};
				scrollbar-track-color: ${this.deadAreaColor};
				scrollbar-arrow-color: ${this.deadAreaColor};
				scrollbar-shadow-color: ${this.deadAreaColor};
				scrollbar-darkshadow-color: ${this.deadAreaColor};`;
    },
  },
  watch: {
    deadAreaColor() {
      this.setColors();
    },
  },
  mounted() {
    this.setColors();
    this.updateSyncedScroll();
  },
  methods: {
    updateSyncedScroll() {
      const b = this.$refs.tbody;
      const l = b.scrollLeft;
      if (this.scrollHorizontal) {
        if (this.syncHeaderScroll) {
          const h = this.$refs.thead;
          if (h.scrollLeft !== l) {
            h.scrollLeft = l;
          }
        }
        if (this.includeFooter && this.syncFooterScroll) {
          const f = this.$refs.tfoot;
          if (f.scrollLeft !== l) {
            f.scrollLeft = l;
          }
        }
      }
      this.$emit('scroll', b.scrollTop, l, b.scrollHeight, b.scrollWidth);
    },
    setColors() {
      const s = this.$refs.table.style;
      s.setProperty('--dead-area-color', this.deadAreaColor);
    },
    onDragEnterHeader(e) {
      this.$emit('header-dragenter', e);
    },
    onDragOverHeader(e) {
      this.$emit('header-dragover', e);
    },
    onDropHeader(e) {
      this.$emit('header-drop', e);
    },
  },
};
</script>
<style>
    table.scrolling {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        overflow: hidden;
        /* Use this to create a "dead" area color if table is too wide for cells */
        background-color: #ccc;
        --dead-area-color: #ccc;
    }
    table.scrolling thead,
    table.scrolling tfoot {
        /* Grow automatically to fit content, don't shrink it proportionately to the body. */
        flex: 0 0 auto;
        display: block;
        /* Horizontal scrolling, when allowed, is controlled by JS, not a scroll bar. */
        overflow: hidden;
    }
    table.scrolling tbody {
        display: block;
        flex: 1 1 auto;
        /* Disable all scrolling by default */
        overflow: hidden;
    }
    /* Turn on vertical scrolling for all elements so scroll bars take up the same space */
    table.scrolling.scrolly tbody,
    table.scrolling.scrolly thead.scrollsync,
    table.scrolling.scrolly tfoot.scrollsync {
        overflow-y: auto;
    }
    /* Turn on horizontal scrolling for the body only */
    table.scrolling.scrollx tbody {
        overflow-x: auto;
    }
    /*
    For Webkit, use "dead area" color to hide vertical scrollbar functions in the header and footer.
    Since WebKit supports CSS variables and style attributes don't support pseudo-classes, use variables.
    Display is set because otherwise Chrome ignores the other styling.
    TODO: on Chrome/Safari for Mac, scrollbars are not shown anyway and this creates an extra block. No impact on iOS Safari.
    */
    table.scrolling.scrolly thead.scrollsync::-webkit-scrollbar {
        display: block;
        background-color: var(--dead-area-color);
    }
    table.scrolling.scrolly thead.scrollsync::-webkit-scrollbar-track {
        background-color: var(--dead-area-color);
    }
    /* IE11 adds an extra tbody, have to hide it. */
    table.scrolling tbody:nth-child(3) {
        display: none;
    }
    /* The one caveat to scrolling this way: a hard-set width is required. Can override in thead/tbody slot. */
    table.scrolling td,
    table.scrolling th {
        border: 1px solid #ddd;
        /* These must all be set the same in your overriding CSS */
        width: 10em;
        min-width: 10em;
        max-width: 10em;
        /* Important in case your data is too long for your cell */
        overflow: hidden;
        word-wrap: break-word;
    }
    table.scrolling td:first-child,
    table.scrolling th:first-child {
        border-left: 1px solid #ddd;
    }
    table.scrolling td {
        background-color: #fff;
    }
    table.scrolling > thead:first-child > tr:first-child th {
        background-color: #f7f7f7;
        border-top: 1px solid #ddd;
    }

    table.scrolling.freeze-first-column thead tr,
    table.scrolling.freeze-first-column tbody tr {
        display: block;
        width: min-content;
    }

    table.scrolling.freeze-first-column tbody td:first-child, table.scrolling.freeze-first-column tbody th:first-child, table.scrolling.freeze-first-column thead td:first-child, table.scrolling.freeze-first-column thead th:first-child {
        position: sticky;
        position: -webkit-sticky;
        left: 0;
    }
</style>
