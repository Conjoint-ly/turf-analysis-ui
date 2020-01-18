<template functional>
  <div v-if="props.node.type === 'group'" class="conditional-logic-group" :style="`margin-left: ${props.depth*10}px`">
    If {{ props.node.operator === props.groups.AND.value ? 'all' : 'any' }} of those are true:
    <logic
      v-for="child in props.node.children"
      :node="child"
      :questions="props.questions"
      :items="props.items"
      :depth="props.depth+1"
    />
  </div>
  <div
    v-else
    class="conditional-logic-rule"
    :style="`margin-left: ${props.depth*10}px`"
    v-html="$options.getDescriptionForRule(props.node, props.questions, props.items)"
  />
</template>

<script>
import operators from '../../../components/additional-questions/logic/operators';
import groups from '../../../components/additional-questions/logic/groups';

function s(value) {
  return window.DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
}

export default {
  props: {
    /**
             * Rule or group of rules
             */
    node: {
      type: Object,
      required: true,
    },

    /**
             * Available operators for additional questions
             */
    operators: {
      type: Object,
      default: () => operators,
    },

    /**
             * Available logic groups for additional questions
             */
    groups: {
      type: Object,
      default: () => groups,
    },

    /**
             * Question list
             */
    questions: {
      type: Object,
      required: true,
    },

    /**
             * Items list
             */
    items: {
      type: Object,
      required: true,
    },

    /**
             * Current depth
             */
    depth: {
      type: Number,
      required: true,
    },
  },

  getDescriptionForRule(node, questions, items) {
    if (node.rule === 'question') {
      return this.getDescriptionForQuestionRule(node, questions, items);
    }
    if (node.rule === 'variable') {
      return this.getDescriptionForVariableRule(node);
    }
    if (node.rule === 'js') {
      return this.getDescriptionForJSFunctionRule(node);
    }
  },

  getDescriptionForQuestionRule(node, questions, items) {
    if (!node.inputs.question) {
      return 'Answer for question';
    }

    const question = questions[node.inputs.question];
    const questionName = `Q${question.AQseqNum} ${question.name || question.pureText}`;
    switch (node.inputs.operator) {
      case operators.SHOWN.value: {
        return `Question "${questionName}" is shown`;
      }
      case operators.NOT_SHOWN.value: {
        return `Question "${questionName}" is not shown`;
      }
      case operators.EQUAL.value: {
        return `Answer for question "${questionName}" is equal to "${s(node.inputs.value)}"`;
      }
      case operators.NOT_EQUAL.value: {
        return `Answer for question "${questionName}" is not equal to "${s(node.inputs.value)}"`;
      }
      case operators.EQUAL_NUMBER.value: {
        return `Answer for question "${questionName}" is equal to "${s(node.inputs.value)}"`;
      }
      case operators.NOT_EQUAL_NUMBER.value: {
        return `Answer for question "${questionName}" is not equal to "${s(node.inputs.value)}"`;
      }
      case operators.SELECT.value: {
        return `Answer for question "${questionName}" is equal to "${s(items[node.inputs.value].text || items[node.inputs.value].type)}"`;
      }
      case operators.NOT_SELECT.value: {
        return `Answer for question "${questionName}" is not equal to "${s([node.inputs.value].text || items[node.inputs.value].type)}"`;
      }
      case operators.SUBSTRING.value: {
        return `Answer for question "${questionName}" must contain string "${s(node.inputs.value)}"`;
      }
      case operators.NOT_SUBSTRING.value: {
        return `Answer for question "${questionName}" must not contain string "${s(node.inputs.value)}"`;
      }
      case operators.LESS.value: {
        return `Answer for question "${questionName}" is less than "${node.inputs.value}"`;
      }
      case operators.LESS_OR_EQUAL.value: {
        return `Answer for question "${questionName}" is less or equal than "${node.inputs.value}"`;
      }
      case operators.GREATER.value: {
        return `Answer for question "${questionName}" is greater than "${node.inputs.value}"`;
      }
      case operators.GREATER_OR_EQUAL.value: {
        return `Answer for question "${questionName}" is greater of equal than "${node.inputs.value}"`;
      }
      case operators.BETWEEN.value: {
        return `Answer for question "${questionName}" is between "${node.inputs.value.gte}" and "${node.inputs.value.lte}"`;
      }
      case operators.IN.value: {
        return `Answer for question "${questionName}" is among ${node.inputs.value.map((v) => `"${s(items[v].text || items[v].type)}"`).join(', ')}`;
      }
      case operators.NOT_IN.value: {
        return `Answer for question "${questionName}" is not among ${node.inputs.map((v) => `"${s(items[v].text || items[v].type)}"`).value.join(', ')}`;
      }
      default: {
        return 'Answer for question';
      }
    }
  },

  getDescriptionForVariableRule(node) {
    const { variable } = node.inputs;
    switch (node.inputs.operator) {
      case operators.EQUAL.value: {
        return `GET variable "${variable}" is equal to "${s(node.inputs.value)}"`;
      }
      case operators.NOT_EQUAL.value: {
        return `GET variable "${variable}" is not equal to "${s(node.inputs.value)}"`;
      }
      default: {
        return 'GET variable is';
      }
    }
  },

  getDescriptionForJSFunctionRule(node) {
    return `JS function (<i class="far fa-question" title="${node.inputs.function}"></i>) returns true`;
  },
};

</script>
