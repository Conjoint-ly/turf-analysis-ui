const state = new Map();

const events = ['resize'];

function getContainer(el) {
  let node = el.parentNode;
  while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1) {
    if (node.hasAttribute('sticky-container')) {
      return node;
    }
    node = node.parentNode;
  }
  return el.parentNode;
}

function getScroll(el) {
  let scroll = 0;
  let node = el;
  while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1) {
    scroll += node.scrollTop;
    node = node.parentNode;
  }

  return scroll;
}

function setState(el) {
  state.set(el, {
    placeholder: document.createElement('div'),
    parent: el.parentNode,
    container: getContainer(el),
  });
}

function makeSticky(el, { arg, modifiers, value }) {
  let elements; let placeholderRect; let parentRect; let
    style;

  elements = state.get(el);
  parentRect = elements.parent.getBoundingClientRect();

  try { // Hack for IE11 bug if element not attached to DOM
    placeholderRect = elements.placeholder.getBoundingClientRect();
  } catch (e) {
    placeholderRect = {};
  }

  style = {
    el: {
      position: 'fixed',
      top: arg === 'top' ? (modifiers.parent ? `${parentRect.top + getScroll(el)}px` : 0) : 'auto',
      bottom: 'auto',
      left: `${placeholderRect.left}px`,
      width: `${placeholderRect.width}px`,
      zIndex: value && value.zIndex ? value.zIndex : el.style.zIndex,
    },
    placeholder: {
      paddingTop: 0,
      height: `${el.clientHeight}px`,
    },
  };

  if (modifiers.class) {
    elements.placeholder.className = el.className;
  }

  requestAnimationFrame(() => {
    Object.assign(el.style, style.el);
    Object.assign(elements.placeholder.style, style.placeholder);
  });
}

export default {
  inserted(el, bind, vnode) {
    vnode.context.$nextTick(() => {
      if (!state.has(el)) {
        setState(el);
      }

      const elements = state.get(el);
      elements.parent.insertBefore(elements.placeholder, el);
      makeSticky(el, bind);

      events.forEach((event) => {
        window.addEventListener(event, () => (!vnode.context._inactive ? makeSticky(el, bind) : null), {
          passive: true,
        });
        elements.container.addEventListener(event, () => (!vnode.context._inactive ? makeSticky(el, bind) : null), {
          passive: true,
        });
      });
    });
  },
  componentUpdated(el, bind, vnode) {
    if (!state.has(el)) {
      setState(el);
    }

    !vnode.context._inactive ? makeSticky(el, bind) : null;
  },
  unbind(el) {
    state.delete(el);
  },
};
