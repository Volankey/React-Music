'use strict';

import { combineReducers } from 'redux';
import MusicReducer from './MusicReducer';
import CDDataReducer from './CDDataReducer';
import SongListDataReducer from './SongListDataReducer';
import PlayingListReducer from './PlayingListReducer';
import SearchReducer from './SearchReducer';

const rootReducer = combineReducers({
    MusicReducer,
    CDDataReducer,
    SongListDataReducer,
    PlayingListReducer,
    SearchReducer,

});

export default rootReducer;