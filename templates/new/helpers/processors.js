import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import uuid from 'uuid';
import DOMPurify from 'dompurify';

import filters from './filters';
import templates from './templates';
import defaults from './defaults';
import overrides from './overrides';
import fields from './fields';

export default {
  key(item) {
    item.key = uuid();
  },
  question(item, payload) {
    let parent; let childrens; let parameters; let isAmong; let
      pureText;

    switch (true) {
      case filters.conjoint(item):
        parent = payload.questions.find((parent) => parent.type == 'conjoint').key;
        isAmong = 'conjoint';
        break;

      case filters.randomisation(item):
        parent = payload.questions.find((parent) => parent.AQseqNum == item.RQseqNum).key;
        isAmong = 'randomisation';
        break;

      default:
        parent = null;
        isAmong = 'single';
        break;
    }

    switch (item.type) {
      case 'conjoint':
        childrens = payload.questions.filter(filters.conjoint).map((child) => child.key);
        break;

      case 'randomisationblock':
        childrens = payload.questions
          .filter(filters.randomisationByAQ.bind(item.AQseqNum))
          .map((child) => child.key);
        break;

      default:
        childrens = [];
        break;
    }

    parameters = item.parameters
      ? item.parameters
      : {
        ...templates.parameters[item.type],
        ...defaults.parameters[item.type],
      };

    pureText = parameters.title
      ? DOMPurify.sanitize(parameters.title, {
        ALLOWED_TAGS: [],
      })
      : DOMPurify.sanitize(item.text, {
        ALLOWED_TAGS: [],
      });

    item.parameters = parameters;
    if (payload.items !== undefined) {
      const items = payload.items
        ? payload.items.filter(filters.byAQ.bind(item.AQseqNum)).map((item) => item.key)
        : [];
      if (item.items === undefined) {
        item.items = [];
      }
      for (let i = 0; i < items.length; i++) {
        item.items.push(items[i]);
      }
    }

    return {
      ...cloneDeep(templates.question),
      ...cloneDeep(defaults.question[item.type]),
      ...pick(item, ['key', ...fields.question]),
      parent,
      isAmong,
      childrens,
      pureText,
      ...cloneDeep(overrides.question[[item.type, item.answerType].join('.')]),
    };
  },
  item(item, parent) {
    if (!item.parameters) item.parameters = {};

    return {
      ...cloneDeep(templates.item),
      ...cloneDeep(defaults.items[parent.type]),
      ...pick(item, ['key', ...fields.item]),
    };
  },
  nestedItem(item, parent) {
    item.key = uuid(); // hack for normalizr

    item.AQseqNum = parent.AQseqNum;

    if (!item.parameters) item.parameters = {};

    return {
      ...cloneDeep(templates.item),
      ...cloneDeep(defaults.items[parent.type]),
      ...pick(item, ['key', ...fields.item]),
    };
  },
  parameter(item, parent) {
    item.key = uuid(); // hack for normalizr

    return {
      ...cloneDeep(templates.parameters),
      ...cloneDeep(defaults.parameters[parent.type]),
      ...item,
    };
  },
};
