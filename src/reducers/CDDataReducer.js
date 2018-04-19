import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/CDListType';
const  initialState = Immutable({
    data:{
        cdlist:[

        ]
    },
    start:0,
    end:0,
    loading:false
});
function setValue(o,k,v) {

    return Immutable.set(o,k,v);
}
function setIn(o,a,v) {

    return Immutable.setIn(o,a,v);
}
function replace(o,n,b=true) {
    return Immutable.replace(o,n,{deep:b});
}

//正在取回数据
function fetchingData(state,action) {

    return setValue(state,"loading",true);

}

function setData(state,action) {
    return replace(state,{
        data:action.playload.data,
        loading:false,
        start:action.playload.start,
        end:action.playload.end
    })
}
function setMore(state,action) {

    let cd_list = Immutable.asMutable(state.data.cdlist);
    let songlist =  cd_list[0].songlist.concat(action.playload.list);

    cd_list = setIn(cd_list,["0","songlist"],songlist);
    // cd_list[0].songlist = songlist;
    console.log(cd_list);
    return replace(state,{
        data:{
            ...state.data,
            cdlist:cd_list
        },
        loading:false,
        start:action.playload.start,
        end:action.playload.end
    })
}
export default  function CDDataReducer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.CD_SONG_FETCHING: return fetchingData(state,action);

        case TYPE.CD_SONG_FETCHEND: return setData(state,action);

        case TYPE.CD_SONG_LOADMORE: return setMore(state,action);

        default:
            return state;
    }
}
