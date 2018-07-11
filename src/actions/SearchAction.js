import {tools,domain} from '../tools/Tools';
import * as TYPE from '../constants/SearchListType';


export function loadMore() {

    return (dispatch,getState)=>{
        let state = getState().SearchReducer;

        let p = state.p+1;
        // let e = state.end+15;
        let key = state.data.keyword;

        if(!key)
            return;

        if(!state.loading && !state.noMore){

            dispatch({
                type:TYPE.SEARCH_LIST_FETCHING,
                meta:"正在取回搜索数据成功",

            });

            tools.fetch(
                {
                    // http://localhost:3001/apis/search?k=%E9%B9%BF%E6%99%97&p=1
                    url:`http://${domain}:3001/apis/search?k=${key}&p=${p}`,
                    dataType:"json",
                }
            ).then((res)=>{

                let list = res.data.song.list;
                dispatch({
                    type:TYPE.SEARCH_LOADMORE,
                    meta:"取回搜索数据成功",
                    payload:{
                        list:list,
                        p:p,
                        noMore:list.length===0
                    }
                })

            });

        }


    }
}

export function getData(key){

    return (dispatch,getState)=>{
        let state = getState().SearchReducer;

        if(state.isloading==true || key==undefined)
            return;
        let p = 1;


        if(state.data.song && key===state.data.keyword){
            // s = state.end;
            // e = state.end+15;
            return;
        }


        dispatch({
            type:TYPE.SEARCH_LIST_FETCHING,
            meta:"正在取回搜索列表数据",
        });


        tools.fetch(
            {

                url:`http://${domain}:3001/apis/search?k=${key}&p=${p}`,
                dataType:"json",
            }
        ).then((res)=>{
            console.log(res);
            dispatch({
                type:TYPE.SEARCH_LIST_FETCHEND,
                meta:"取回搜索列表数据成功",
                payload:{
                    data:res.data,
                    p:p,

                }
            })
            // this.setState({
            //     data:Immutable(res)
            // })

        });
    }
}

export function getHotKey() {
    return (dispatch,getState)=>{
        tools.fetch(
            {

                url:`http://${domain}:3001/apis/hotwords`,
                dataType:"json",
            }
        ).then((res)=>{
            console.log(res);
            dispatch({
                type:TYPE.HOT_KEY,
                meta:"获取热门搜索",
                payload:{
                    hotkey:res.data.hotkey
                }
            })

        });
    }
}