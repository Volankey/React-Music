import  * as TYPE from '../constants/PlayerType';
import Immutable from "seamless-immutable";
import {myplayer,tools} from '../tools/Tools'

const STATUS_PLAYING = 'STATUS_PLAYING',
      STATUS_PAUSE = 'STATUS_PAUSE',
      STATUS_EMPTY = 'STATUS_EMPTY',
      SINGLE_LOOP = 'SINGLE_LOOP',
      LIST_QUE = 'LIST_QUE',
      LIST_LOOP = 'LIST_LOOP',
      LIST_RANDOM = 'LIST_RANDOM';


var player =  myplayer();


const  initialState = Immutable({
        mode:LIST_LOOP,
        status:STATUS_EMPTY,
        song:{
            name:"暂无歌曲",
            singer:"小白",
            currentTime:0,
            index:-1,
            id:null
        },
        lyric:null,
        playingList:[
            {
                name:"Love The Way You Lie ",
                singer:"Eminem/Rihanna",
                id:"003bOtQz24HvqN",

            },
            {
                name:"说散就散",
                singer:"袁维娅",
                id:"003vUjJp3QwFcd"
            }


        ]

});
export default  function MusicPlayer(state=initialState,action){
    // console.log(action);
    switch (action.type)
    {
        case TYPE.MUSIC_LYRIC:{

           let data = action.playload.lyric;
                 data.id= action.playload.id;
        return  Immutable.set(state,"lyric",data);
        }
        break;

        case TYPE.MUSIC_MODE:{
            const modes = [LIST_LOOP,SINGLE_LOOP,LIST_RANDOM];
            let current = modes.indexOf(state.mode);
            let idx = (current+1)%modes.length;
            return  Immutable.set(state,"mode",modes[idx]);
        }
            break;
        case TYPE.STATUS_PLAYING:{
            return  Immutable.set(state,"status",TYPE.STATUS_PLAYING);
        }
            break;
        case TYPE.STATUS_PAUSE:{
            return  Immutable.set(state,"status",TYPE.STATUS_PAUSE);
        }
            break;

        case TYPE.MUSIC_LOADING:
        {
            let list = state.playingList;
            let idx = action.playload.idx;

            player.src = action.playload.src;
            player.load();

            return state;
        }
            break;

        case TYPE.MUSIC_INFO:
        {


            let currentTime = action.playload.current;
            // console.log(currentTime);


                return  Immutable.setIn(state,["song","currentTime"],currentTime);


        }
        break;

        case TYPE.MUSIC_PLAY:
        {

            let list = state.playingList;

            let idx = state.song.index;

            let status = state.status;

            if(status === STATUS_EMPTY){
                idx = (idx+1)%list.length;

                player.loadMusic(list[idx].id);

                status = STATUS_PLAYING;
            }
            else if(status === STATUS_PLAYING){
                player.pause();
                status = STATUS_PAUSE;
            }
            else{
                player.play();
                status = STATUS_PLAYING;

                let new_state =  Immutable.set(state,"status",status);
                return new_state;

            }


            let new_state  = Immutable.replace(state,{
                ...state,
               status:status,
               song: {
                   name: list[idx].name,
                   singer: list[idx].singer,
                   currentTime: state.song.currentTime,
                   index: idx,
                   id:list[idx].id
               }
            },{deep:true});

            return new_state;
        }
            break;
        case TYPE.MUSIC_PAUSE: {
            state.player.pause();
            return state;
        }
            break;

        case TYPE.MUSIC_END: {

            let list = state.playingList;
            // let idx = (state.song.index+1)%list.length;

            let idx = state.song.index+1;

            //单曲循环
            if(state.mode === SINGLE_LOOP){
                player.play();
                return state;
            }//列表顺序
            else if(state.mode === LIST_RANDOM){
                idx = Math.floor(Math.random()*list.length);
                console.log("播放 "+idx);

            }
            else{
                idx = idx%list.length;
            }
            //准备播放下一首



            let status = state.status;

            player.loadMusic(list[idx].id);
            // player.src=list[idx].src;
            // player.play();
            let new_state  = Immutable.replace(state,{
                ...state,
                status:status,
                song: {
                    name: list[idx].name,
                    singer: list[idx].singer,
                    currentTime: 0,
                    index: idx,
                    id:list[idx].id
                }
            },{deep:true});

            return new_state;
        }
            break;

        case TYPE.MUSIC_NEXT: {
            let type = action.playload.type;
            let list = state.playingList;

            let idx = state.song.index+type;
            idx = idx<0?list.length-1:idx%list.length;


            player.loadMusic(list[idx].id);

            let new_state  = Immutable.replace(state,{
                ...state,
                status:STATUS_PLAYING,
                song: {
                    name: list[idx].name,
                    singer: list[idx].singer,
                    currentTime: 0,
                    index: idx,
                    id:list[idx].id
                },

            },{deep:true});



            return new_state;
        }
        break;

        default:
            return state;
    }
}
