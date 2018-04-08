import {DATA_CHANGE, SCORE_CHANGE} from '../actions/types';

const INITIAL_STATE = {
    score: 0,
    data: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DATA_CHANGE:
            return {...state, data: action.payload};
        case SCORE_CHANGE:
            return {...state, score: action.payload};
        default:
            return state;
    }
}