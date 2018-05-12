import React, { Component } from 'react';

import {
    Route,
    withRouter,
    Link
} from 'react-router-dom';
import data from './data.json';
import List from '../../compoents/List'
import './index.css';
import RecentList from '../RecentList';

import { connect } from 'react-redux'; // 引入connect函数
class Mypage extends Component {


    render() {
        return (
            <div className="content my-page ignore">

                <div className="list-wrap ignore">

                    <List
                        data={data.data.disslist}
                        renderItem={(item,index)=>{
                            return (

                                <Link to={"/home/list/"+item.tid} key={item.tid}>
                                    <div  className="diss-item">
                                        <img className="ignore" src={item.diss_cover} alt=""/>
                                        <div className="intro">
                                            <p>{item.diss_name}</p>
                                            <p>{item.song_cnt}首</p>
                                        </div>
                                    </div>
                                </Link>

                            )
                        }}
                    >
                        <div className="avatar">
                            <div className="icon">
                                <img src={require("./avatar.jpg")} alt=""/>
                                <span>未登录</span>
                            </div>
                            <div className="desc">
                                <p className="text-center">今日听歌15分钟</p>
                            </div>
                        </div>

                        <div className="main">
                            <Link to={"/home//list/2306806058"}>
                                <div className="ignore btn  bg-like"></div>
                                <p className="text-center">我喜欢</p>
                                <p className="text-center">97</p>
                            </Link>
                            <Link to={"/home/recent"}>
                                <div className="ignore btn bg-recent"></div>
                                <p className="text-center">最近播放</p>
                                <p className="text-center">{this.props.recentList.length}</p>
                            </Link>

                        </div>

                        <div className="my-list">
                            <p className="text-center">我的歌单</p>
                            <p className="list-num">3个歌单</p>
                        </div>
                    </List>


                </div>



            </div>

        );
    }
}

export default connect(
    (state) => ({
        recentList:state.PlayingListReducer.history,

    }),
    (dispatch) => ({

    })
)(Mypage)
