import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/SearchListType';
import * as tools from './ReducerTools';
import {setValue} from "./ReducerTools";

const  initialState = Immutable({
    data:{
        song: {
            list: []
        }
    },
    hotkey:[],
    last_time:0,
    loading:false,
    history:[],
    p:1,
    noMore:false
});



//正在取回数据
function fetchingData(state,action) {

    if(action.playload && action.playload.notMore){
        return tools.setValue(state,"noMore",true);
    }
    return tools.setValue(state,"loading",true);

}

function setData(state,action) {
    return tools.replace(state,{
        ...state,
        data:action.playload.data,
        loading:false,
        p:action.playload.p,
        noMore:false,
    })
}
function setMore(state,action) {
    if(action.playload.list.length==0){
        return setValue(state,"noMore",true);
    }
    let list = Immutable.asMutable(state.data.song.list);
    let songlist =  list.concat(action.playload.list);

    // list = tools.setIn(list,["0","songlist"],songlist);

    return tools.replace(state,{
        ...state,
        data:{
            ...state.data,
            song:{
                ...state.data.song,
                list : songlist
            }
        },
        loading:false,
        p:action.playload.p,

    })
}
function setHotKey(state,action) {
    return tools.setValue(state,"hotkey",action.playload.hotkey)
}
export default  function CDDataReducer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.SEARCH_LIST_FETCHING: return fetchingData(state,action);

        case TYPE.SEARCH_LIST_FETCHEND: return setData(state,action);

        case TYPE.SEARCH_LOADMORE: return setMore(state,action);

        case TYPE.HOT_KEY:return setHotKey(state,action);

        default:
            return state;
    }
}
