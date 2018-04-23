'use strict';

import { combineReducers } from 'redux';
import MusicReducer from './MusicReducer';
import CDDataReducer from './CDDataReducer';
import SongListDataReducer from './SongListDataReducer';
import PlayingListReducer from './PlayingListReducer';
const rootReducer = combineReducers({
    MusicReducer,
    CDDataReducer,
    SongListDataReducer,
    PlayingListReducer

});

export default rootReducer;