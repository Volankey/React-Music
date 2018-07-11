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

    if(action.payload && action.payload.noMore){
        return tools.setValue(state,"noMore",true);
    }
    return tools.setValue(state,"loading",true);

}

function setData(state,action) {
    return tools.replace(state,{
        ...state,
        data:action.payload.data,
        loading:false,
        p:action.payload.p,
        noMore:action.payload.data.song.curnum<20

    })
}
function setMore(state,action) {
    // if(action.payload.list.length==0){
    //     return setValue(state,"noMore",true);
    // }
    let list = Immutable.asMutable(state.data.song.list);
    let songlist =  list.concat(action.payload.list);

    // list = tools.setIn(list,["0","songlist"],songlist);
    console.log(action.payload)
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
        p:action.payload.p,
        noMore:action.payload.noMore,
    })
}
function setHotKey(state,action) {
    return tools.setValue(state,"hotkey",action.payload.hotkey)
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
