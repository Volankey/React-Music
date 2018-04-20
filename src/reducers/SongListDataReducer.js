import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/SongListType';
import * as tools from './ReducerTools';

const  initialState = Immutable({
    data:{
        list:[

        ]
    },
    slider:[],
    last_time:0,
    loading:false
});

//正在取回数据
function fetchingData(state,action) {

    return tools.setValue(state,"loading",true);

}

function setData(state,action) {
    console.log(action.playload.data);
    return tools.replace(state,{
        ...state,
        data:action.playload.data,
        loading:false,
        last_time:new Date().getTime(),

    })
}

function setSlider(state,action) {

    return tools.setValue(state,"slider",action.playload.slider)

}

export default  function SongListDataReducer(state=initialState,action){
    console.log(state);
    switch (action.type)
    {
        case TYPE.SONG_LIST_FETCHING: return fetchingData(state,action);

        case TYPE.SONG_LIST_FETCHEND: return setData(state,action);

        case TYPE.SONG_SLIDER_FETCHEND: return setSlider(state,action);

        default:
            return state;
    }
}
