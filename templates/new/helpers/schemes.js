import { schema } from 'normalizr';
import processors from './processors';

export default {
  denormalize: {
    questions: [
      new schema.Entity('questions', {
        items: [new schema.Entity('items')],
        parameters: new schema.Entity('parameters'),
      }),
    ],
  },
  normalize: {
    json: {
      questions: [
        new schema.Entity(
          'questions',
          {
            items: [
              new schema.Entity(
                'items',
                {},
                {
                  idAttribute: 'key',
                  processStrategy: processors.nestedItem,
                },
              ),
            ],
            parameters: new schema.Entity(
              'parameters',
              {},
              {
                idAttribute: 'key',
                processStrategy: processors.parameter,
              },
            ),
          },
          {
            idAttribute: 'key',
            processStrategy: processors.question,
          },
        ),
      ],
    },
    new: {
      questions: [
        new schema.Entity(
          'questions',
          {
            parameters: new schema.Entity(
              'parameters',
              {},
              {
                idAttribute: 'key',
                processStrategy: processors.parameter,
              },
            ),
            items: [
              new schema.Entity(
                'items',
                {},
                {
                  idAttribute: 'key',
                  processStrategy: processors.nestedItem,
                },
              ),
            ],
          },
          {
            idAttribute: 'key',
            processStrategy: processors.question,
          },
        ),
      ],
    },
    existent: {
      questions: [
        new schema.Entity(
          'questions',
          {
            parameters: new schema.Entity(
              'parameters',
              {},
              {
                idAttribute: 'key',
                processStrategy: processors.parameter,
              },
            ),
          },
          {
            idAttribute: 'key',
            processStrategy: processors.question,
          },
        ),
      ],
      items: [
        new schema.Entity(
          'items',
          {},
          { idAttribute: 'key', processStrategy: processors.item },
        ),
      ],
    },
  },
};
