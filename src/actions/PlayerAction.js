import * as TYPE from '../constants/PlayerType';
import {tools} from '../tools/Tools';
//获取列表信息
export function play(music) {



    return (dispatch,getState) => {
        let{ MusicReducer } = getState();
        let list = MusicReducer.songList;
        let idx = MusicReducer.idx;
        dispatch(
            {
                type: TYPE.MUSIC_PLAY,
                playload: {
                    data: music,

                },
                meta: "开始播放"
            }
        )
    }
}
//获取列表信息
export function pause() {



    return dispatch => {
        dispatch(
            {
                type: TYPE.MUSIC_PAUSE,
                meta: "暂停播放"
            }
        )
    }
}
export function updateTime(t) {
    return dispatch => {
        dispatch(
            {
                type: TYPE.MUSIC_INFO,
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
        dispatch(
            {
                type: status,
                meta: status
            }
        )
    }
}

export function getLyric(id) {
    return (dispatch,getState) => {

        tools.fetch({
            url:'http://192.168.1.104:3001/apis/lyric?id='+id,
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
                    meta: "播放下一首"
                }
            )
        })

    }
}


export function playNext(type) {
    return dispatch => {
        dispatch(
            {
                type: TYPE.MUSIC_NEXT,
                playload: {
                    type
                },
                meta: "播放下一首"
            }
        )
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




