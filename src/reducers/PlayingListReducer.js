import Immutable from "seamless-immutable";
import  * as TYPE from '../constants/PlayingListType';
import  * as PLAYER_TYPE from '../constants/PlayerType';
import {setValue,setIn,replace} from "./ReducerTools";
import { tools }  from '../tools/Tools';

var localPlaying = getPlayingListFromstorage();

const  initialState = Immutable({
    show:false,
    playingList:localPlaying.LOCAL_LIST,
    list:localPlaying.LIST_MAP,
    history:getFromstorage("history"),
    last:getLastFromstorage()
});

function getPlayingListFromstorage() {
    var LOCAL_LIST  = JSON.parse(tools.getFromLocal("playingList"));
    var list = {};
    for(let item of LOCAL_LIST) {
        list[item.id] = item;
    }
    return {
        LOCAL_LIST:LOCAL_LIST?LOCAL_LIST:[],
        LIST_MAP :list
    };

}
//存储到localstorage
function storage(key,list) {
    setTimeout(function () {
        tools.setToLocal(key,JSON.stringify(list));
    },0);

}
//获取playingList从localstorage
function getFromstorage(key) {
    var LOCAL_LIST  = JSON.parse(tools.getFromLocal(key));

    return LOCAL_LIST?LOCAL_LIST:[];

}
//获取playingList从localstorage
function getLastFromstorage() {
    var index  = JSON.parse(tools.getFromLocal("last"));

    return index?index:null;

}




function setShow(state,flag) {
    return setValue(state,"show",flag)
}


function deleteById(state,action) {
    let list = {},
        playlist = state.playingList;
    let song = action.payload.song;

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
    if(playlist.length===0){
        return initialState;
    }


    storage("playingList",playlist);


    let n =  replace(state,{
        ...state,
        playingList:playlist,
        list
    });


    return n;

}

function handleAdd(state,action) {
    //否则将这首歌加入到当前歌曲的下一首
    let playingList = Immutable.asMutable(state.playingList),
        list = Immutable.asMutable(state.list),
        currentSong = action.payload.currentSong;

    let index = currentSong.index+1;
    let addList = [];
    //列表的话替换当前的播放列表
    if(action.payload.song.length){
        list={};
        addList = Array.from(action.payload.song,function (song,i) {

                let t_song = action.payload.getSong(song);
                t_song.index = i;
                // {
                //     album: song.album.mid,
                //     currentTime: 0,
                //     duration: song.interval,
                //     id: song.mid,
                //     index: index + i,
                //     name: song.name,
                //     singer: tools.getSinger(song.singer)
                // };

                list[song.id] = t_song;
                return t_song;


        });
        playingList = [];
    }
    else{
        //添加单手歌曲
        if(state.list[action.payload.song.id]==null){
            list[action.payload.song.id]=action.payload.song;
            addList = Array.from([action.payload.song]);
        }

    }
    // addList = addList.filter((obj)=>{
    //     return obj!=null;
    // });

    playingList.splice(currentSong.index+1,0,...addList);
    playingList = Immutable(playingList);


    // debugger;
    console.log("播放列表:",playingList);

    return {
        ...state,
        list,
        song: action.payload.song,
        playingList,
    }


}
function addPlayingList(state,action) {

    // debugger;
    //如果已经存在那么直接播放这个歌曲
    if(state.list[action.payload.song.id]){

        return setValue(state,"song",action.payload.song);
    }
    console.log(state);
    /*
    //否则将这首歌加入到当前歌曲的下一首
    let playingList = Immutable.asMutable(state.playingList),
        currentSong = action.payload.currentSong;

    action.payload.song.index = currentSong.index+1;

    playingList.splice(currentSong.index+1,0,action.payload.song);
    playingList = Immutable(playingList);

    let new_state = setIn(state,["list",action.payload.song.id],action.payload.song);
    // debugger;
    console.log("播放列表:",playingList);
    */

    let new_state = handleAdd(state,action);

    //存储到localstorage

    storage("playingList",new_state.playingList);

    return replace(state,new_state);
}
function clearList(state,action) {

    //存储到localstorage
    storage("playingList",[]);
    storage("last",null);
    return Immutable.merge(state,{
        show:false,
        playingList:[],
        list:{

        }
    });


}
function saveToHistory(state,action) {
    let song = action.payload.song;
    // alert(state.history);
    let historyList = Immutable.asMutable(state.history);

    for(var i =0 ,max = historyList.length;i<max;i++){
        if(historyList[i].id == song.id)
            break;
    }


    historyList.splice(i,1);

    let len = historyList.unshift(song);

    //存储超过200首那么删掉最后一首
    if(len>200){
        historyList.pop();
    }

    storage("history",historyList);
    storage("last",song);
    return setValue(state,"history",historyList)
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

        case PLAYER_TYPE.MUSIC_PLAY :return saveToHistory(state,action);

        default:
            return state;
    }
}