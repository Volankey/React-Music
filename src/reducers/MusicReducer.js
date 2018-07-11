import * as TYPE from '../constants/PlayerType';
import * as LIST_TYPE from '../constants/PlayingListType';
import Immutable from "seamless-immutable";
import * as tools from './ReducerTools';

import {tools as commonTools} from '../tools/Tools'
const initSong  = {
    name: "暂无歌曲",
    singer: "小白",
    currentTime: 0,
    index: -1,
    id: null,
    duration: 0,
    albumUrl: "http://www.bimdiot.net/images/demo.jpg"
};
const getAlbumUrl = (song)=>{
    let albumUrl = "http://www.bimdiot.net/images/demo.jpg";
    if(song.album && song.album!=""){
        albumUrl =  'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + (song.album) + '.jpg?max_age=2592000';
    }
   return albumUrl;
};

const last_song =()=>{
    let song = JSON.parse(commonTools.getFromLocal("last"));
    if(song){
        song.albumUrl = getAlbumUrl(song);
        // if(song.album && song.album!=""){
        //     song.albumUrl =  'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + (song.album) + '.jpg?max_age=2592000';
        // }
        // else
        //     song.albumUrl ='http://www.bimdiot.net/images/demo.jpg';

    }
    else{
       song = initSong;
    }
    return song;

};

const initialState = Immutable({

    //播放模式
    mode: TYPE.LIST_LOOP,
    //播放状态
    status: TYPE.STATUS_EMPTY,
    //当前歌曲
    song: last_song(),
    //当前歌曲的歌词
    lyric: null,
    //播放列表
    // playingList:[
    //
    //     // {
    //     //     name:"Love The Way You Lie ",
    //     //     singer:"Eminem/Rihanna",
    //     //     id:"003bOtQz24HvqN",
    //     //     album:"003ZkPcz3miTVA"
    //     //
    //     //
    //     // },
    //     // {
    //     //     name:"说散就散",
    //     //     singer:"袁维娅",
    //     //     id:"003vUjJp3QwFcd",
    //     //     album:"001xl4uF3OU04A"
    //     // }
    //
    //
    // ],
    // list:{
    //
    // }

});





function setLyric(state, action) {
    let data = action.payload.lyric;
    data.id = action.payload.id;
    return tools.setValue(state, "lyric", data);
}

//播放模式
const modes = [TYPE.LIST_LOOP, TYPE.SINGLE_LOOP, TYPE.LIST_RANDOM];

function setMode(state, action) {
    let current = modes.indexOf(state.mode);
    let idx = (current + 1) % modes.length;
    return tools.setValue(state, "mode", modes[idx]);
}


function setStatus(state, action) {

    return tools.setValue(state, "status", action.payload.status);
}

function setCurrentTime(state, action) {

    return tools.setIn(state, ["song", "currentTime"], action.payload.current);
}
function initPlayer() {

    return tools.setValue(initialState,"song",initSong);

}
function playMusic(state, action) {
    let payload = action.payload;

    // //如果没有歌曲了
    // if(state.playingList.length===0)
    //     return initialState;


    let song = payload.song,
        status = payload.status,
        albumUrl = getAlbumUrl(song);
    song = tools.setValue(song, "albumUrl", albumUrl);

    return tools.replace(state, {
        ...state,
        status: status,
        song: song
    });


}
export default function MusicPlayer(state = initialState, action) {
    // console.log(action);
    switch (action.type) {
    case TYPE.MUSIC_LYRIC:
        return setLyric(state, action);

    case TYPE.MUSIC_MODE:
        return setMode(state, action);

    case TYPE.CHANGE_STATUS:
        return setStatus(state, action);

    case TYPE.SET_CURRENTTIME:
        return setCurrentTime(state, action);

    case TYPE.MUSIC_PLAY:
        return playMusic(state, action);

    case TYPE.MUSIC_NEXT:
        return playMusic(state, action);

    case TYPE.PLAYER_INIT:
        return initPlayer();
    case LIST_TYPE.CLEAR_PLAYING_LIST: return initPlayer();
        //
        // case TYPE.ADD_TO_PLAING : return addPlayingList(state,action);
        //
        // case TYPE.CLEAR_PLAYING_LIST: return clearList(state,action);
        //
        // case TYPE.DELETE_SONG: return deleteById(state,action);


    default:
        return state;
    }
}
