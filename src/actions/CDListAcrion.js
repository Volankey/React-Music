import {tools,domain} from '../tools/Tools';
import * as TYPE from '../constants/CDListType';

export function loadMore() {

    return (dispatch,getState)=>{
        let state = getState().CDDataReducer;

        let s = state.start+15;
        // let e = state.end+15;
        let id = state.data.cdlist[0].disstid;


        if(!state.loading && s < state.data.cdlist[0].songnum){
            dispatch({
                type:TYPE.CD_SONG_FETCHING,
                meta:"正在取回歌单列表数据",

            });
            tools.fetch(
                {

                    url:`http://${domain}:3001/apis/list_data?id=${id}&s=${s}&n=15`,
                    dataType:"json",
                }
            ).then((res)=>{
                console.log(res);
                dispatch({
                    type:TYPE.CD_SONG_LOADMORE,
                    meta:"取回歌单列表数据成功~",
                    playload:{
                        list:res.cdlist[0].songlist,
                        start:s,

                    }
                })

            });

        }

    }
}

export function getData(id){

    return (dispatch,getState)=>{
        let state = getState().CDDataReducer;

        let s = 0;


        if(state.data.cdlist[0] && id===state.data.cdlist[0].disstid){
             // s = state.end;
             // e = state.end+15;
            return;
        }


        dispatch({
            type:TYPE.CD_SONG_FETCHING,
            meta:"正在取回歌单列表数据",
            playload:{
                notMore:true
            }
        });


        tools.fetch(
            {

                url:`http://${domain}:3001/apis/list_data?id=${id}&s=${s}&n=0`,
                dataType:"json",
            }
        ).then((res)=>{
            console.log(res);
            dispatch({
                type:TYPE.CD_SONG_FETCHEND,
                meta:"取回歌单列表数据成功 ",
                playload:{
                    data:res,
                    start:s,
                }
            })
            // this.setState({
            //     data:Immutable(res)
            // })

        });
    }
}