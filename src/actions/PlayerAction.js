import * as TYPE from '../constants/PlayerType';
import {myplayer,tools} from '../tools/Tools';
import domian from '../tools/domian';
var player = myplayer();
//播放音乐
function getMusic(song,status,dispatch) {

    getLyric(song.id,dispatch);

    tools.fetch(
        {
            url:'http://'+domian+':3001/apis/vkey?id='+song.id,
            dataType:"json",
        }
    ).then(response=>{
        player.src = response.url;
        player.play();

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
        // console.log(response);
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

            let list = state.playingList;

            let idx = state.song.index;

            let status = state.status;

            if(status === TYPE.STATUS_EMPTY){
                idx = (idx+1)%list.length;

                // let song = list[idx];
                status = TYPE.STATUS_PLAYING;

                let song={
                    ...list[idx],
                    currentTime: 0,
                    index: idx,
                };

                getMusic(song,status,dispatch);


            }
            else if(status === TYPE.STATUS_PLAYING){
                player.pause();
                status = TYPE.STATUS_PAUSE;
                setStatus(dispatch,status);
            }
            else {
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
        let state= getState().MusicReducer;
        let list = state.playingList;

        let idx = state.song.index+1;

        //单曲循环
        if(state.mode === TYPE.SINGLE_LOOP){
            player.play();
            return state;
        }//随机
        else if(state.mode === TYPE.LIST_RANDOM){
            idx = Math.floor(Math.random()*list.length);
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


        //准备播放下一首
        getMusic(song,status,dispatch);
    }
}

export function playNext(type) {



    return (dispatch,getState) => {
        let state = getState().MusicReducer;
        let list = state.playingList;

        let idx = state.song.index+type;
        idx = idx<0?list.length-1:idx%list.length;

        let status = TYPE.STATUS_PLAYING;

        let song={
            ...list[idx],
            currentTime: 0,
            index: idx,
        };

        getMusic(song,status,dispatch);

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
                meta: "改变播放模式"
            }
        )
    }
}




