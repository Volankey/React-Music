import * as TYPE from '../constants/PlayingListType';
import * as PLAYER_TYPE from '../constants/PlayerType';
import {getMusic,player,getNext} from  './PlayerAction';
export function show() {
    return (dispatch,getState) => {
        dispatch(
            {
                type: TYPE.PLAYING_LIST_SHOW,
                meta:"显示播放列表"
            }
        );

    }
}
export function hide() {
    return (dispatch,getState) => {
        dispatch(
            {
                type: TYPE.PLAYING_LIST_HIDE,
                meta:"隐藏播放列表"
            }
        );

    }
}

export function clearList() {

    return (dispatch,getState)=>{
        player.pause();
        dispatch({
            type:TYPE.CLEAR_PLAYING_LIST,
            meta:"清空播放列表",
            playload:{
                status:PLAYER_TYPE.STATUS_EMPTY
            }
        })
    }
}
export function addToPlayingList(data,getSong) {


    let singgers =   data.singer.map(function (singer) {
        return singer.name
    }).join("-");




    return (dispatch,getState)=>{
        let state= getState().MusicReducer;
        let status =  PLAYER_TYPE.STATUS_PLAYING;

        let idx = state.song.index+1;


        let song ={};


        song = getSong(data);
        song.index = idx;






        dispatch(
            {
                type: TYPE.ADD_TO_PLAING,
                meta: "添加了一首歌",
                playload:{
                    song,
                    currentSong:state.song
                }
            }
        );
        let list = getState().PlayingListReducer.playingList;
        //准备播放下一首
        getMusic(song,status,dispatch,list);




    }

}
export function deleteById(song) {
    return (dispatch,getState) => {


        let state = getState().MusicReducer;



        let currentId = state.song.id;

        let list = getState().PlayingListReducer.playingList;

        let next_song=getNext(list,state.song.index);

        dispatch(
            {
                type: TYPE.DELETE_SONG,
                meta: "从播放列表删除歌曲",
                playload:{
                    song
                }
            }
        );

        if(currentId === song.id){

            player.pause();
            let list = getState().MusicReducer.playingList;

            if(list.length==0){
                player.pause();
                return;
            }


            getMusic(next_song,PLAYER_TYPE.STATUS_PLAYING,dispatch,list);
        }
    }
}
