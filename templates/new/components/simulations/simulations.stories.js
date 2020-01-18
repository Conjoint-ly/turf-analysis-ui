import { storiesOf } from '@storybook/vue';

import component from './index';
import markdown from './index.md';

const defaults = {
  id: 758,
  folder_id: null,
  name: 'Fruits (two-stage brand specific)',
  description: '',
  product: 'fruit',
  product_description: null,
  goal: null,
  status: 1,
  acceptResponses: 1,
  createdat: '2017-06-25 00:12:09',
  updated_at: '2019-09-04 03:34:28',
  updated_by: 1,
  listSettings: null,
  template: 'supermarket_hidden',
  respondent_option: null,
  attributeOrder: 'random',
  alternativeOrder: 'none',
  opt_out_option: 'two_stage',
  enableAnonymous: 0,
  enableIpFilter: 0,
  enableCookiesFilter: 0,
  enableQuickTerminationFilter: 0,
  enableBadWordsFilter: 0,
  customTexts: '{"SURVEY_WELCOME":"<p> Welcome to this study. We need to understand your preferences in fruit.</p>","SURVEY_QUESTION":"Which of the following fruit do you want to eat?","SURVEY_TWO_STAGE":"Given no other choice in fruit, would you eat this fruit?","SURVEY_TWO_STAGE_YES":"Yes, I would","SURVEY_TWO_STAGE_NO":"No, I would try to go for something else","SURVEY_CONTINUE_BACK_POSITION":"direct","SURVEY_THANK_YOU":"<p>Thanks. Here is your code: [Conjoint.ly-Unique-Respondent-Code]</p>"}',
  minsamplesize: 340,
  nblocks: 8,
  joinToken: 'f7zms26lie',
  analysis_status: 'done',
  alternativesPerSet: 0,
  maxNumberSet: 0,
  prohibitPairs: '[]',
  applicability: [
    ['A1L2', 'A2L1'],
    ['A1L4', 'A2L1'],
    ['A1L5', 'A2L1'],
    ['A1L6', 'A2L1'],
    ['A1L7', 'A2L1'],
    ['A1L2', 'A2L3'],
    ['A1L4', 'A2L3'],
    ['A1L5', 'A2L3'],
    ['A1L6', 'A2L3'],
    ['A1L7', 'A2L3'],
    ['A1L3', 'A3L1'],
    ['A1L4', 'A3L1'],
    ['A1L5', 'A3L1'],
    ['A1L6', 'A3L1'],
    ['A1L7', 'A3L1'],
    ['A1L4', 'A3L2'],
    ['A1L5', 'A3L2'],
    ['A1L7', 'A3L2'],
    ['A1L4', 'A3L3'],
    ['A1L5', 'A3L3'],
    ['A1L1', 'A3L4'],
    ['A1L7', 'A3L4'],
    ['A1L1', 'A3L5'],
    ['A1L2', 'A3L5'],
    ['A1L7', 'A3L5'],
    ['A1L1', 'A3L6'],
    ['A1L2', 'A3L6'],
    ['A1L3', 'A3L6'],
    ['A1L7', 'A3L6']],
  type: 'brand-specific',
  is_max_diff: 0,
  locale: null,
  payment_status: 'paid',
  analysis_request: 'none',
  analysis_n: 155,
  analysis_min_n: 3,
  enableAlternativeHeaders: 0,
  launched_at: '2017-06-25 00:24:18',
  delayAnswerEnable: 0,
  delayAnswer: 0,
  cannot_edit_after_launch: 0,
  disableCapturing: 0,
  reportCurrencyFormat: null,
  locked_for_editing: 0,
  locked_for_design: 0,
  temp_customisation: '',
  temp_no_randomisation: null,
  calibratingQuestionsMaxCount: null,
  predictionQuestionsMaxCount: null,
  predictionNeedsComments: null,
  languageDetection: 'auto',
  project_id: null,
  parameters: null,
  temp_design_customisation: null,
  simulationData: '[{"id":"UH7XJ5MFEO347","name":"Worksheet 1","scenarios":[{"id":"327MID1XR46G9","name":"Scenario 1","show":true,"segment":0,"price":null,"productType":"sop","concepts":[{"id":"36YZNME5D1C03","name":"Banana","show":true,"color":"#9b6bbb","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L1","A2":"A2L1","A3":"A3L1"}},{"id":"O766Y1H1E69QM","name":"Apple","show":true,"color":"#d40360","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L2","A2":"A2L2","A3":"A3L1"}},{"id":"09U5EJD12BQQV","name":"Pear","show":true,"color":"#97e5e7","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L3","A2":"A2L1","A3":"A3L2"}},{"id":"8YC8ZGH4B55ZV","name":"Mango","show":true,"color":"#5293ca","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L4","A2":"A2L2","A3":"A3L4"}},{"id":"OK00CHOKZCC68","name":"Marakuja","show":true,"color":"#b7ce93","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L5","A2":"A2L2","A3":"A3L4"}},{"id":"JLEFLHZ6KDVOF","name":"Apricot","show":true,"color":"#502133","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L6","A2":"A2L2","A3":"A3L2"}},{"id":"A39IGHVOBH6JO","name":"Plum","show":true,"color":"#58a84f","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0,"revenue":0,"attributes":{"A1":"A1L7","A2":"A2L2","A3":"A3L3"}}],"none":{"id":"JDUHY8KDKZR03","name":"None of the above","show":true,"color":"#dc1e9d","adjustedPreferenceShare":0,"simulatedPreferenceShare":0,"actualMarketShare":0,"relativeAvailability":0}}]}]',
  uuid: 'd46435f0-1eff-4881-85cf-ea9f9db73a92',
};
storiesOf('Components|Simulations', module).add(
  '758 Experiment simulations',
  () => ({
    components: { simulations: component },
    template: `<simulations :experiment="${defaults}"></simulations>`,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);