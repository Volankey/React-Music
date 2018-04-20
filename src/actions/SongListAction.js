import {tools,domain} from '../tools/Tools';
import * as TYPE from '../constants/SongListType';


export function getData(){

    return (dispatch,getState)=>{
        let state = getState().SongListDataReducer;

        let last_time = state.last_time,
            now_time  = new Date().getTime();

        /*
        * 这里应该有一个时间的对比，上次请求时间和本次时间进行对比
        * 如果小于时间间隔，那么则不发送网络请求
        *
        * */

        if(now_time  < 300000 + last_time){
            return;
        }





        // if(state.data.cdlist[0] && id===state.data.cdlist[0].disstid){
        //     // s = state.end;
        //     // e = state.end+15;
        //     return;
        // }


        dispatch({
            type:TYPE.SONG_LIST_FETCHING,
            meta:"正在取回歌单数据",
        });

        tools.fetch(
            {

                url:`http://${domain}:3001/apis/sliders`,
                dataType:"json",
            }
        ).then(res=>{

            dispatch({
                type:TYPE.SONG_SLIDER_FETCHEND,
                meta:"获取轮播图",
                playload:{
                    slider:res.data.slider,
                }
            })
        });

        tools.fetch(
            {

                url:`http://${domain}:3001/apis/song_list`,
                dataType:"json",
            }
        ).then((res)=>{
            console.log(res);
            dispatch({
                type:TYPE.SONG_LIST_FETCHEND,
                meta:"取回歌单数据成功",
                playload:{
                    data:res.data,
                }
            })


        });
    }
}