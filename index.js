const Vue = require('vue').default;

require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');

const TurfHeader = require('./components/header/TurfHeader.vue').default;
const TurfLayout = require('./components/layout/TurfLayout.vue').default;

Vue.component('turf-header', TurfHeader);
Vue.component('turf-layout', TurfLayout);
