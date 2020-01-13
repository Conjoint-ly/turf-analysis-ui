import {SET} from "@/components/simulations/store/mutation-types";

export default {
    state:{
        segments:[]
    },
    mutations:{
        [SET]: (state, {segments}) => {
            state.segments = segments;
        }
    }
}
