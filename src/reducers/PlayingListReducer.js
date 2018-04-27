import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/PlayingListType';

import {setValue,setIn,replace} from "./ReducerTools";
// import * as tools from './ReducerTools';

const  initialState = Immutable({
    show:false,
    playingList:[

    ],
    list:{

    }
});

function setShow(state,flag) {
    return setValue(state,"show",flag)
}


function deleteById(state,action) {
    let list = {},
        playlist = state.playingList;
    let song = action.playload.song;

    //找到这首歌
    let index = -1;

    for(var i = 0,max = playlist.length; i < max ; i++){
        let id = playlist[i].id;

        list[id] =  playlist[i];
        if(id === song.id){
            index = i ;
        }

    }




    playlist = Immutable.asMutable(playlist);



    playlist.splice(index,1);






    delete list[song.id];

    //如果没有歌曲了
    if(playlist.length===0)
        return initialState;

    let n =  replace(state,{
        ...state,
        playingList:playlist,
        list
    });


    return n;

}
function addPlayingList(state,action) {

    // debugger;
    //如果已经存在那么直接播放这个歌曲
    if(state.list[action.playload.song.id]){

        return setValue(state,"song",action.playload.song);
    }
    console.log(state);
    //否则将这首歌加入到当前歌曲的下一首
    let playingList = Immutable.asMutable(state.playingList),
        currentSong = action.playload.currentSong;

    action.playload.song.index = currentSong.index+1;
    playingList.splice(currentSong.index+1,0,action.playload.song);
    playingList = Immutable(playingList);

    let new_state = setIn(state,["list",action.playload.song.id],action.playload.song);
    // debugger;
    console.log("播放列表:",playingList);
    return replace(new_state,{
        ...new_state,
        song: action.playload.song,
        playingList,
    });
}
function clearList(state,action) {

    return initialState;


}
export default  function PlayingListReducer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.PLAYING_LIST_SHOW: return setShow(state,true);

        case TYPE.PLAYING_LIST_HIDE: return setShow(state,false);

        case TYPE.ADD_TO_PLAING : return addPlayingList(state,action);

        case TYPE.CLEAR_PLAYING_LIST: return clearList(state,action);

        case TYPE.DELETE_SONG: return deleteById(state,action);

        default:
            return state;
    }
}