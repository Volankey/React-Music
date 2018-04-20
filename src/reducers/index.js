'use strict';

import { combineReducers } from 'redux';
import MusicReducer from './MusicReducer';
import CDDataReducer from './CDDataReducer';
import SongListDataReducer from './SongListDataReducer';
const rootReducer = combineReducers({
    MusicReducer,
    CDDataReducer,
    SongListDataReducer,

});

export default rootReducer;