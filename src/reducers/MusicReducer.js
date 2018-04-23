import  * as TYPE from '../constants/PlayerType';
import Immutable from "seamless-immutable";
import * as tools from './ReducerTools';
import {setIn} from "./ReducerTools";
import {setValue} from "./ReducerTools";


const  initialState = Immutable({

        //播放模式
        mode:TYPE.LIST_LOOP,
        //播放状态
        status:TYPE.STATUS_EMPTY,
        //当前歌曲
        song:{
            name:"暂无歌曲",
            singer:"小白",
            currentTime:0,
            index:-1,
            id:null,
            duration:0,
            album:"http://www.bimdiot.net/images/demo.jpg"
        },
        //当前歌曲的歌词
        lyric:null,
        //播放列表
        playingList:[

            // {
            //     name:"Love The Way You Lie ",
            //     singer:"Eminem/Rihanna",
            //     id:"003bOtQz24HvqN",
            //     album:"003ZkPcz3miTVA"
            //
            //
            // },
            // {
            //     name:"说散就散",
            //     singer:"袁维娅",
            //     id:"003vUjJp3QwFcd",
            //     album:"001xl4uF3OU04A"
            // }


        ],
        list:{

        }

});





function setLyric(state,action) {
    let data = action.playload.lyric;
        data.id= action.playload.id;
    return tools.setValue(state,"lyric",data);
}

//播放模式
const modes = [TYPE.LIST_LOOP,TYPE.SINGLE_LOOP,TYPE.LIST_RANDOM];

function setMode(state,action) {
    let current = modes.indexOf(state.mode);
    let idx = (current+1)%modes.length;
    return tools.setValue(state,"mode",modes[idx]);
}


function setStatus(state,action) {

    return  tools.setValue(state,"status",action.playload.status);
}

function setCurrentTime(state,action) {

    return tools.setIn(state,["song","currentTime"],action.playload.current);
}

function playMusic(state,action) {
    let playload = action.playload;

    let song = playload.song,
        status = playload.status;
        song.album='https://y.gtimg.cn/music/photo_new/T002R300x300M000'+song.album+'.jpg?max_age=2592000';
    return tools.replace(state,{
        ...state,
        status:status,
        song: song
    });


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


    let n =  tools.replace(state,{
        ...state,
        playingList:playlist,
        list
    });


    return n;

}
function addPlayingList(state,action) {

    //如果已经存在那么直接播放这个歌曲
    if(state.list[action.playload.song.id]){

        return setValue(state,"song",action.playload.song);
    }
    console.log(state);
    //否则将这首歌加入到当前歌曲的下一首
    let playingList = Immutable.asMutable(state.playingList),
        currentSong = state.song;

    action.playload.song.index = currentSong.index+1;
    playingList.splice(currentSong.index+1,0,action.playload.song);
    playingList = Immutable(playingList);

    let new_state = setIn(state,["list",action.playload.song.id],action.playload.song);
  // debugger;
    console.log("播放列表:",playingList);
    return tools.replace(new_state,{
        ...new_state,
        song: action.playload.song,
        playingList,
    });
}
function clearList(state,action) {

    return initialState;


}
export default  function MusicPlayer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.MUSIC_LYRIC: return setLyric(state,action);

        case TYPE.MUSIC_MODE: return setMode(state,action);

        case TYPE.CHANGE_STATUS: return setStatus(state,action);

        case TYPE.SET_CURRENTTIME: return setCurrentTime(state,action);

        case TYPE.MUSIC_PLAY: return playMusic(state,action);

        case TYPE.MUSIC_NEXT: return playMusic(state,action);

        case TYPE.ADD_TO_PLAING : return addPlayingList(state,action);

        case TYPE.CLEAR_PLAYING_LIST: return clearList(state,action);

        case TYPE.DELETE_SONG: return deleteById(state,action);
        default:
            return state;
    }
}
