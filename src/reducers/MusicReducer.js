import  * as TYPE from '../constants/PlayerType';
import Immutable from "seamless-immutable";


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
            {
                name:"Love The Way You Lie ",
                singer:"Eminem/Rihanna",
                id:"003bOtQz24HvqN",
                album:"003ZkPcz3miTVA"


            },
            {
                name:"说散就散",
                singer:"袁维娅",
                id:"003vUjJp3QwFcd",
                album:"001xl4uF3OU04A"
            }


        ]

});

/*-----------------
* 步骤 1.提取工具函数
*------------------
*/

/*
*  setValue(o,k,v)
*  用于设置变量的值
*  参数1 元对象 2对象的属性 3 要设置的值
*
* */
function setValue(o,k,v) {

    return Immutable.set(o,k,v);
}
/*
*  setIn(o,a,v)
*  用于设置变量的值
*  参数1 元对象 2属性层次数组 3 要设置的值
*
* */
function setIn(o,a,v) {

    return Immutable.setIn(o,a,v);
}

/*
*   replace(o,n,b=true)
*   用于替换
*   参数1 源对象 2 新对象 3 deep？
*
* */
function replace(o,n,b=true) {
    return Immutable.replace(o,n,{deep:b});
}

/*
* 步骤2
* 提取 case reducer
*
*
* */



function setLyric(state,action) {
    let data = action.playload.lyric;
        data.id= action.playload.id;
    return setValue(state,"lyric",data);
}

//播放模式
const modes = [TYPE.LIST_LOOP,TYPE.SINGLE_LOOP,TYPE.LIST_RANDOM];

function setMode(state,action) {
    let current = modes.indexOf(state.mode);
    let idx = (current+1)%modes.length;
    return setValue(state,"mode",modes[idx]);
}


function setStatus(state,action) {

    return  setValue(state,"status",action.playload.status);
}

function setCurrentTime(state,action) {

    return setIn(state,["song","currentTime"],action.playload.current);
}

function playMusic(state,action) {
    let playload = action.playload;

    let song = playload.song,
        status = playload.status;
        song.album='https://y.gtimg.cn/music/photo_new/T002R300x300M000'+song.album+'.jpg?max_age=2592000';
    return replace(state,{
        ...state,
        status:status,
        song: song
    });


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


        default:
            return state;
    }
}
