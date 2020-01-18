import interact from 'interactjs';

function resizeEvent() {
  const resizeEvent = window.document.createEvent('UIEvents');
  resizeEvent.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(resizeEvent);
}

function bind(el, { arg, modifiers, value }, { context }) {
  const unit = modifiers.percent ? '%' : 'px';
  const { hideable } = modifiers;

  const hiddenFlag = value && value.hiddenFlag ? value.hiddenFlag : 'hiddenFlag';
  const min = value && value.min ? value.min : 15;
  const max = value && value.max ? value.max : 50;

  interact(el).resizable({
    edges: {
      top: ['top', 'height'].includes(arg),
      right: ['right', 'width'].includes(arg),
      bottom: ['bottom', 'height'].includes(arg),
      left: ['left', 'width'].includes(arg),
    },
  }).on('resizestart', () => {
    document.documentElement.style.setProperty('pointer-events', 'none');
    document.documentElement.style.setProperty('-webkit-user-select', 'none');
    document.documentElement.style.setProperty('-moz-user-select', 'none');
    document.documentElement.style.setProperty('-ms-user-select', 'none');
    document.documentElement.style.setProperty('user-select', 'none');
  }).on('resizemove', (event) => {
    if (['width', 'right'].includes(arg)) {
      let width = modifiers.percent
        ? (event.rect.width * 100) / el.parentElement.getBoundingClientRect().width
        : event.rect.width;

      context[hiddenFlag] = !!(hideable && width < min / 3);

      if (width < min) width = min;

      if (width > max) width = max;

      requestAnimationFrame(() => {
        el.style.width = width + unit;
        resizeEvent();
      });
    }
  })
    .on('resizeend', () => {
      document.documentElement.style.removeProperty('pointer-events');
      document.documentElement.style.removeProperty('user-select');
      document.documentElement.style.removeProperty('-ms-user-select');
      document.documentElement.style.removeProperty('-moz-user-select');
      document.documentElement.style.removeProperty('-webkit-user-select');
    });
}

export default {
  bind,
};
