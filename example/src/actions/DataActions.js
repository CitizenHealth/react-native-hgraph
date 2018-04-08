import {DATA_CHANGE, SCORE_CHANGE} from './types';

export const setData = (data) => {
    return (dispatch) => {
        dispatch({
            type: DATA_CHANGE,
            payload: data
        });
    }
}

export const setScore = (score) => {
    return (dispatch) => {
        dispatch({
            type: SCORE_CHANGE,
            payload: Math.floor(score)
        });
    }
}