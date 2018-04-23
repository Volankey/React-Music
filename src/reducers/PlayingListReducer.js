import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/PlayingListType';

import {setValue} from "./ReducerTools";

const  initialState = Immutable({
   show:false
});

function setShow(state,flag) {
    return setValue(state,"show",flag)
}
export default  function PlayingListReducer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.PLAYING_LIST_SHOW: return setShow(state,true);

        case TYPE.PLAYING_LIST_HIDE: return setShow(state,false);


        default:
            return state;
    }
}