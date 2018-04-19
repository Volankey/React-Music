'use strict';

import { combineReducers } from 'redux';
import MusicReducer from './MusicReducer';
import CDDataReducer from './CDDataReducer';

const rootReducer = combineReducers({
    MusicReducer,
    CDDataReducer

});

export default rootReducer;