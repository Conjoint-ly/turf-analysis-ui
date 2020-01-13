import Vue from 'vue';
import Sidebar from '@conjointly/turf-analysis-ui/templates/layout/Sidebar';
import Layout from '@conjointly/turf-analysis-ui/templates/layout/Layout';

/*
import Checkbox from './templates/components/elements/checkbox';
import Colorpicker from './templates/components/elements/colorpicker';
import Editable from './templates/components/elements/editable';
import EditableHeader from './templates/components/elements/editable-header';
import FormGroupVW from './templates/components/elements/form-group-vw';
import FormatModal from './templates/components/elements/format-modal';
import FroalaEditor from './templates/components/elements/froala-editor';
import InputNumberPercentage from './templates/components/elements/input-number-percentage';
import Panel from './templates/components/elements/panel';
import ValidationWrapper from './templates/components/elements/validation-wrapper';

import CopyButton from './templates/components/elements/buttons/copy';
import CreateButton from './templates/components/elements/buttons/create';
import CustomButton from './templates/components/elements/buttons/custom';
import DeleteButton from './templates/components/elements/buttons/delete';
import DragButton from './templates/components/elements/buttons/drag';
import FormatButton from './templates/components/elements/buttons/format';
import ToggleButton from './templates/components/elements/buttons/toggle';
import HideDetailsButton from './templates/elements/buttons/hide-details';
import RemoveButton from './templates/elements/buttons/remove';

import LoadingButton from './templates/elements/LoadingButton';
import Modal from './templates/elements/modal';
import PivotTable from './templates/elements/pivot-table';
import ScrollingTable from './templates/elements/scrolling-table';
import Select2 from './templates/elements/select2';
import TabsNav from './templates/elements/tabs-nav';

import PageSize from './templates/elements/data-table/page-size';
import Search from './templates/elements/data-table/search';
import Showing from './templates/elements/data-table/showing';

import PrevNextClose from './templates/elements/modal/prev-next-close';

import ValidationGroup from './templates/elements/validation/group';
import ValidationIcon from './templates/elements/validation/icon';
import ValidationWrapper2 from './templates/elements/validation/wrapper';


import Attribute from './templates/components/simulations/components/attribute'
import ChooseSourceOfBusiness from './templates/components/simulations/components/choose-source-of-business'
import ChooseSourceOfBusinessModal from './templates/components/simulations/components/choose-source-of-business-modal'
import ConceptName from './templates/components/simulations/components/concept-name'
import MarketShareAdjustment from './templates/components/simulations/components/market-share-adjustment'
import MovementsInPreferenceShareChart from './templates/components/simulations/components/movements-in-preference-share-chart'
import PreferenceShareChart from './templates/components/simulations/components/preference-share-chart'
import RevenueChart from './templates/components/simulations/components/revenue-chart'
import RevenueFormula from './templates/components/simulations/components/revenue-formula'
import RevenueSettingsModal from './templates/components/simulations/components/revenue-settings-modal'
import ScenarioBlock from './templates/components/simulations/components/scenario-block'
import ScenarioHeader from './templates/components/simulations/components/scenario-header'
import ScenarioHeaders from './templates/components/simulations/components/scenario-headers'
import ShowWorksheetListButton from './templates/components/simulations/components/show-worksheet-list-button'
import WorksheetHeader from './templates/components/simulations/components/worksheet-header'
import WorksheetSourceOfBusiness from './templates/components/simulations/components/worksheet-source-of-business'
import WorksheetWhatIf from './templates/components/simulations/components/worksheet-what-if'
*/
import VueSelect from './templates/components/elements/vue-select';


require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');
require('select2/dist/css/select2.min.css');
require('select2-bootstrap-theme/dist/select2-bootstrap.min.css');
require('select2');

// eslint-disable-next-line no-undef
window.$ = jQuery;

window.$.fn.select2.defaults.set('theme', 'bootstrap');

Vue.component('turf-sidebar', Sidebar);
Vue.component('turf-layout', Layout);
Vue.component('turf-select', VueSelect);
