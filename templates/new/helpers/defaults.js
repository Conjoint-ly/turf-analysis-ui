import get from 'lodash/get';

export default {
  fuseOptions: {
    keys: ['AQseqNum', 'type', 'pureText'],
    threshold: 0,
  },
  question: {
    intro: {
      text: '',
    },
    multiple: {
      text: '',
    },
    short: {
      text: '',
      answerRegexp: '',
    },
    capture: {
      text: '',
    },
    likert: {
      maxLabel: get(window, 'languagePhraseValues.additionalQuestion.maxLabel:likert', 'Strongly agree'),
      maxValue: 5,
      minLabel: get(window, 'languagePhraseValues.additionalQuestion.minLabel:likert', 'Strongly disagree'),
      minValue: 1,
    },
    constantsum: {
      sum: 100,
      sumLabel: get(window, 'languagePhraseValues.additionalQuestion.sumLabel:constantsum', 'Total'),
    },
    gg: {
      text: get(
        window,
        'languagePhraseValues.additionalQuestion.text:gg',
        '<p>Would you buy this product at the price of [Price]?</p><blockquote> Insert product description and images.</blockquote>',
      ),
    },
  },
  parameters: {
    gg: {
      no: get(window, 'languagePhraseValues.additionalQuestion.parameters.no:gg', '✖ No'),
      qualifying: 1,
      qualifying_no: get(window, 'languagePhraseValues.additionalQuestion.parameters.qualifying_no:gg', '✖ No'),
      qualifying_text: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_text:gg',
        '<p>Please consider the following product:</p><blockquote> Insert product description and images.</blockquote><p>Would you buy this product at all?</p>',
      ),
      qualifying_yes: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_yes:gg',
        '✔ Yes',
      ),
      yes: get(window, 'languagePhraseValues.additionalQuestion.parameters.yes:gg', '✔ Yes'),
    },
    vw: {
      cheap: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.cheap:vw',
        '...<b>a bargain</b>—a great buy for the money?',
      ),
      expensive: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.expensive:vw',
        '...<b>starting to get expensive</b>, so that it is not out of the question, but you would have to give some thought to buying it?',
      ),
      max_price: 1000,
      min_price: 1,
      nms: 1,
      nms_max_label: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_max_label:vw',
        'Very likely to buy',
      ),
      nms_min_label: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_min_label:vw',
        'Very unlikely to buy',
      ),
      nms_text: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_text:vw',
        'On a scale of 1 to 5, how likely are you to buy this product at the price of $[Price]?',
      ),
      qualifying: 1,
      qualifying_no: get(window, 'languagePhraseValues.additionalQuestion.parameters.qualifying_no:vw', '✖ No'),
      qualifying_text: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_text:vw',
        '<p>Please consider the following product:</p><blockquote> Insert product description and images.</blockquote><p>Would you buy this product at all?</p>',
      ),
      qualifying_yes: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_yes:vw',
        '✔ Yes',
      ),
      title: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.title:vw',
        '<p>At what price would you consider the following product to be...<br><small>(Please insert only dollar amount)</small></p><blockquote> Insert product description and images.</blockquote>',
      ),
      too_high: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.too_high:vw',
        '...so expensive that you <b>would not consider buying it</b>?',
      ),
      too_low: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.too_low:vw',
        '...priced so low that you would feel the <b>quality couldn’t be very good</b>?',
      ),
    },
    multiple: {
      columns: get(window.additionalQuestionsData, 'multiple.DEFAULT_COLUMNS', 3),
    },
  },
  items: {
    multiple: {
      action: 'none',
      redirectUrl: '',
      redirectAllVars: 0,
      parameters: {
        quotaSize: '',
        fancyNameOn: 0,
        fancyName: '',
      },
    },
    starrating: {
      text: '',
      value: 5,
    },
    constantsum: {
      text: '',
    },
    count: {
      constantsum: 2,
      multiple: 2,
      starrating: 2,
    },
    calculations: {
      starrating() {
        return {
          value: 5,
        };
      },
    },
  },
};
