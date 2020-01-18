import get from 'lodash/get';

export default {
  text: 'Type here',
  items: {
    constantsum: {
      text: 'Type in row name',
    },
    gg: {
      text: '',
      value: '',
    },
    multiple: {
      standard: {
        text: 'Type option',
      },
      other: {
        text: get(window, 'languagePhraseValues.additionalQuestion.question.text:multiple_other', 'Other'),
      },
      none: {
        text: get(
          window,
          'languagePhraseValues.additionalQuestion.question.text:multiple_none',
          'None of the above',
        ),
      },
    },
    starrating: {
      text: 'Type in row name',
    },
  },
  parameters: {
    vw: {
      field_title_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.title:vw',
        '<p>At what price would you consider the following product to be...<br><small>(Please insert only dollar amount)</small></p><blockquote> Insert product description and images.</blockquote>',
      ),
      field_too_low_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.too_low:vw',
        '...priced so low that you would feel the <b>quality couldn’t be very good</b>?',
      ),
      field_cheap_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.cheap:vw',
        '...<b>a bargain</b>—a great buy for the money?',
      ),
      field_expensive_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.expensive:vw',
        '...<b>starting to get expensive</b>, so that it is not out of the question, but you would have to give some thought to buying it?',
      ),
      field_too_high_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.too_high:vw',
        '...so expensive that you <b>would not consider buying it</b>?',
      ),
      field_min_price_default: 1,
      field_max_price_default: 1000,
      field_qualifying_text_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_text:vw',
        '<p>Please consider the following product:</p><blockquote> Insert product description and images.</blockquote><p>Would you buy this product at all?</p>',
      ),
      field_qualifying_yes_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_yes:vw',
        '✔ Yes',
      ),
      field_qualifying_no_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.qualifying_no:vw',
        '✖ No',
      ),
      field_nms_text_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_text:vw',
        'On a scale of 1 to 5, how likely are you to buy this product at the price of $[Price]?',
      ),
      field_nms_min_label_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_min_label:vw',
        'Very unlikely to buy',
      ),
      field_nms_max_label_default: get(
        window,
        'languagePhraseValues.additionalQuestion.parameters.nms_max_label:vw',
        'Very likely to buy',
      ),
    },
  },
};
