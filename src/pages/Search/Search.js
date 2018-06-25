import React, { PureComponent } from 'react';

import List from '../../compoents/List'
import './index.css';

import { connect } from 'react-redux'; // 引入connect函数
import * as SearchAction from "../../actions/SearchAction";
import * as PlayingListAction from "../../actions/PlayingListAction";

import {
    withRouter
} from 'react-router-dom';

const getSong = (data)=>{

    let singgers =   data.singer.map(function (singer) {
        return singer.name
    }).join("-");

     let song = {
        name:data.songname,
        singer:singgers,
        id:data.songmid,
        album:data.albummid,
        duration:data.interval,
        currentTime:0,
    };
     return song;
};
class Search extends PureComponent {

    goBack(){
        this.props.history.goBack();
    }
    search (e){
        e && e.preventDefault();

        this.props.getData(this.state.value);
    };
    constructor(props){
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.hotClick= this.hotClick.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    componentDidMount(){


        this.form.addEventListener("submit",this.search);
        this.props.getHotKey();

    }
    componentWillUnmount(){
        this.form.removeEventListener("submit",this.search);
    }
    hotClick(key){
        this.setState({
            value:key
        },function () {
            this.search();
        })
    }
    renderItem(item,index){
        let singers = item.singer.map(function (singer) {
            return singer.name;
        });
        return(
            <div
                onClick={()=>{
                    this.props.addToPlayingList(item,getSong);
                }}
                className="search-item" key={item.songmid}>
                <p className="title">{item.songname}</p>
                <p className="singer">{singers.join("/")} · {item.albumname}</p>
            </div>
        )
    }
    handleChange(event){

        this.setState({
            value:event.target.value
        },()=>{
            const { value } = this.state;
            //节流
            clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                this.props.getData(value);
            },500);
        })
    }
    render() {
        return (
            <div className="content ignore search-page">
                {/*输入区域开始*/}
                <div className="search-input">
                    <form action="#" ref={(ref)=>{
                        this.form = ref;
                    }}>
                        <input name="key" type="search" value={this.state.value}  onChange={this.handleChange} placeholder="搜索音乐、歌手"/>
                    </form>

                    <span onClick={()=>{
                        this.goBack();
                    }}>取消</span>
                </div>
                {/*输入区域结束*/}

                {/*搜索结果列表*/}
                <div className="search-list-wrap ignore">
                    <List
                        data={this.props.data}
                        renderItem={this.renderItem}
                        isloading={this.props.isloading}
                        end={this.props.loadMore}
                    >
                        {/*热门搜索*/}
                        <div className="hot-key">
                            <p>热门搜索</p>
                            <ul>
                                {
                                    this.props.hotkey.map((item,index)=>{
                                        if(index>14)
                                            return;
                                        return (
                                            <li
                                                onClick={(e)=>{
                                                    e.preventDefault();
                                                    this.hotClick(item.k)
                                                }}
                                                key={index}
                                            >
                                                {item.k}
                                            </li>
                                        )
                                    })
                                }

                            </ul>

                        </div>
                        {/*热门搜索结束*/}

                    </List>
                </div>


            </div>

        );
    }
}

export default withRouter(connect(
    (state) => ({
       data:state.SearchReducer.data.song.list,
        isloading:state.SearchReducer.loading,
        hotkey:state.SearchReducer.hotkey
    }),
    (dispatch) => ({

        getData:(key)=>{
            dispatch(SearchAction.getData(key))
        },
        loadMore:()=>{
            dispatch(SearchAction.loadMore())
        },
        getHotKey:()=>{
            dispatch(SearchAction.getHotKey())
        },
        addToPlayingList: (data,getSong) => {
            dispatch(PlayingListAction.addToPlayingList(data,getSong))
        },

    })
)(Search));

