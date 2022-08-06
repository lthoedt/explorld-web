import {combineReducers} from 'redux'

import journeyReducer from './journeyReducer'

export const mainReducer = combineReducers({
    journey: journeyReducer
})
