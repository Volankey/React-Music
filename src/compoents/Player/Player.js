import React, { Component } from 'react';

import {
    Link,withRouter
} from 'react-router-dom';

import './index.css';


class Player extends Component {

    componentDidMount(){


    }
    goBack(){
        this.props.history.goBack();
    }
    goDetail(){
        this.props.history.push('/music');
    }
    render() {
        let song = this.props.song;
        return (
            <div  id="player">

                    <div className="left" onClick={this.goDetail.bind(this)}>

                        <div className="pic">
                            <div className="pic ignore"  style={{backgroundImage:"url(https://p.qpic.cn/music_cover/JBDCVgqXWXaYUvcsElqcicaBbDJbn3fjJj9pr85VRcLyVGVTyLkZI1Q/300?n=1)"}}></div>
                        </div>
                        <div className="info">
                            <p>{song.name}</p>
                            <p className="singer">{song.singer}</p>
                        </div>
                    </div>


                <div className="btns">
                    <div className="btn ignore btn-play"></div>
                    <div className="btn ignore btn-list"></div>
                </div>


            </div>

        );
    }
}

export default withRouter(Player);
