import * as TYPE from '../constants/PlayerType';
import {myplayer,tools} from '../tools/Tools';
import domian from '../tools/domian';
export  var player = myplayer();
//播放音乐
export function getMusic(song,status,dispatch,list,immediate=true) {
    if(list.length<=0){
        dispatch(
            {
                type: TYPE.PLAYER_INIT,

                meta: "没有音乐执行初始化"
            }
        );
        return;
    }


    if(song==null || song.id==null){
        player.pause();
      return;
    }

    getLyric(song.id,dispatch);


    if(player.firstPlay===true){

        if(immediate==true){
            player.play();
            status = TYPE.STATUS_PAUSE;
            // player.pause();
            player.firstPlay=false;
        }
        else{

            player.pause();
        }


    }

    tools.fetch(
        {
            url:'http://'+domian+':3001/apis/vkey?id='+song.id,
            dataType:"json",
        }
    ).then(response=>{
        player.src = response.url;
        if(immediate==true && player.firstPlay===false){

            player.play();
            status = TYPE.STATUS_PLAYING;
        }
        else{
            status = TYPE.STATUS_PAUSE;
            player.pause();
        }

        // immediate==false?player.pause():"";


    }).then(()=>{
        dispatch(
            {
                type: TYPE.MUSIC_PLAY,
                playload: {
                    song ,
                    status
                },
                meta: "播放音乐"
            }
        );

    });
}

export function getLyric(id,dispatch) {


    tools.fetch({
        url:'http://'+domian+':3001/apis/lyric?id='+id,
        dataType:"json",

    }).then(response=>{
        console.log(response);
        dispatch(
            {
                type: TYPE.MUSIC_LYRIC,
                playload: {
                    lyric:response,
                    id
                },
                meta: "获取歌词"
            }
        )
    })


}

function setStatus(dispatch,status) {
    dispatch(
        {
            type: TYPE.CHANGE_STATUS,
            playload: {
                status
            },
            meta: status
        }
    )
}


//获取列表信息
export function play() {



    return (dispatch,getState) => {
        let state = getState().MusicReducer;

        let list = getState().PlayingListReducer.playingList;

            let idx = state.song.index;

            let status = state.status;


            if(list.length===0){
                alert("您没有歌曲需要播放~");
                return;
            }
            if(status === TYPE.STATUS_EMPTY){
                idx = (idx)%list.length;

                // let song = list[idx];
                status = TYPE.STATUS_PLAYING;

                let song={
                    ...list[idx],
                    currentTime: 0,
                    index: idx,
                };

                getMusic(song,status,dispatch,list);


            }
            else if(status === TYPE.STATUS_PLAYING){
                player.pause();
                status = TYPE.STATUS_PAUSE;
                setStatus(dispatch,status);
            }
            else {
                player.firstPlay=false;
                player.play();
                status = TYPE.STATUS_PLAYING;
                setStatus(dispatch,status);

            }



    }
}
export function updateTime(t) {
    return dispatch => {
        dispatch(
            {
                type: TYPE.SET_CURRENTTIME,
                playload: {
                    current: t
                },
                meta: "更新进度"
            }
        )
    }
}

export function statusChange(status) {
    return dispatch => {
        setStatus(dispatch,status)
    }
}


export function playEnd() {
    return (dispatch,getState)=>{

        if(player.firstPlay || player.first_error) return;

        let state= getState().MusicReducer;
        let list = getState().PlayingListReducer.playingList;

        let idx = state.song.index+1;

        //单曲循环
        if(state.mode === TYPE.SINGLE_LOOP){
            player.play();
            return state;
        }//随机
        else if(state.mode === TYPE.LIST_RANDOM){
            idx = Math.floor(Math.random()*list.length);
            while(idx===state.song.index){
                idx = Math.floor(Math.random()*list.length);
            }

            console.log("播放 "+idx);

        }
        else{
            //列表顺序
            idx = idx%list.length;
        }
        let song={
            ...list[idx],
            currentTime: 0,
            index: idx,
        };
        let status =  TYPE.STATUS_PLAYING;

        //判断是否第一次播放
        let im = player.firstPlay?false:true;

        //准备播放下一首
         getMusic(song,status,dispatch,list,im);
    }
}
export function playByIdx(index) {
    return (dispatch,getState)=>{
        let state= getState().MusicReducer;
        let list = getState().PlayingListReducer.playingList;

        let song={
            ...list[index],
            currentTime: 0,
            index: index,
        };
        let status =  TYPE.STATUS_PLAYING;
        //准备播放下一首
        getMusic(song,status,dispatch,list);
    }
}
// export function clearList() {
//
//     return (dispatch,getState)=>{
//         player.pause();
//         dispatch({
//             type:TYPE.CLEAR_PLAYING_LIST,
//             meta:"清空播放列表",
//             playload:{
//                 status:TYPE.STATUS_EMPTY
//             }
//         })
//     }
// }
// export function addToPlayingList(data,getSong) {
//
//
//      let singgers =   data.singer.map(function (singer) {
//             return singer.name
//         }).join("-");
//
//
//
//
//     return (dispatch,getState)=>{
//         let state= getState().MusicReducer;
//         let status =  TYPE.STATUS_PLAYING;
//
//         let idx = state.song.index+1;
//
//
//         let song ={};
//
//
//         song = getSong(data);
//         song.index = idx;
//
//
//
//
//
//
//         dispatch(
//             {
//                 type: TYPE.ADD_TO_PLAING,
//                 meta: "添加了一首歌",
//                 playload:{
//                     song
//                 }
//             }
//         );
//
//         //准备播放下一首
//         getMusic(song,status,dispatch);
//
//
//
//
//     }
//
// }
//得到下一首index
export function getNext(list,currentIdx,type=1) {
    let idx = currentIdx+type;
    if(idx<0){
        idx = list.length-1;
    }
    else if(idx+1>list.length){
        idx = 0;
    }


    if(list[idx]==null){
        return null;
    }
    let song={
        ...list[idx],
        currentTime: 0,
        index: idx,
    };

    return song;
}
export function playNext(type) {



    return (dispatch,getState) => {
        let state = getState().MusicReducer;
        let list = getState().PlayingListReducer.playingList;


        // idx = idx<0?list.length-1:idx%list.length;

        let status = TYPE.STATUS_PLAYING;

        let song=getNext(list,state.song.index,type);

        getMusic(song,status,dispatch,list);

        // dispatch(
        //     {
        //         type: TYPE.MUSIC_NEXT,
        //         playload: {
        //             type
        //         },
        //         meta: "播放下一首"
        //     }
        // )
    }
}

export function changeMode() {
    return dispatch => {

        dispatch(
            {
                type: TYPE.MUSIC_MODE,
                meta: "改变播放模式",

            }
        )
    }
}





