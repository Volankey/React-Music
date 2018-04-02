'use strict';

import { combineReducers } from 'redux';
import MusicReducer from './MusicReducer';

const rootReducer = combineReducers({
    MusicReducer:MusicReducer


});

export default rootReducer;