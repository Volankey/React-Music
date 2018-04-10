import React, { Component } from 'react';
import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../../actions/PlayerAction";
import { myplayer } from '../../tools/Tools'
import ProgressBar from '../../compoents/ProgressBar/ProgressBar';
import * as TYPE from '../../constants/PlayerType';
import Lyric from '../../compoents/Lyric/Lyric';
import Slider from '../../compoents/Slider';
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import './index.css';

import {
    Link, withRouter
} from 'react-router-dom';
var player = myplayer();
class MusicPlayer extends Component {

    goBack() {
        this.props.history.goBack();
    }
    onloadstart(){
        this.props.getLyric(this.props.song.id);
    }
    componentDidMount() {

        // this.isFirst = false;
        this.cd_wrap_transform="";
        //设置是否更新进度 因为只有这个页面需要进度的显示
        player.onprogress = true;
        //绑定更新进度事件，根据onprogress的值来决定是否解除绑定
        let onprogress = this.props.updateTime;
       this.handleOnProgress = (e)=> {
            // if (player.onprogress){
                onprogress(e.target.currentTime);
            // }
            // else
            //     player.unbind("timeupdate", handleOnProgress);
        };

        player.bind("timeupdate", this.handleOnProgress);
        player.bind("loadstart", this.onloadstart.bind(this));

    }
    componentWillUnmount() {
        //解除绑定，设置是否更新进度为false
        // player.onprogress = false;
        player.unbind("timeupdate", this.handleOnProgress);
    }
    computeBtnClass() {
        let status = this.props.status;






        if (status === TYPE.STATUS_PLAYING) {
            return {
                btn:"btn-pause",
                cd:"play",
                transform:this.cd_wrap_transform
            }
        }
        else {


            return {
                btn:"btn-play",
                cd:"",
                transform:this.cd_wrap_transform
            }
        }

    }
    computeModeClass() {
        let mode = this.props.mode;
        if (mode === TYPE.LIST_LOOP)
            return "btn-loop";
        else if (mode === TYPE.SINGLE_LOOP)
            return "btn-single-loop";
        else
            return "btn-random";
    }
    computeCd(){
        if(this.cd_img){
            let transform = getComputedStyle(this.cd_img).transform;
            transform = transform=="none"?"":transform;
            this.cd_wrap_transform = this.cd_wrap_transform.concat(" ",transform);
        }
    }
    render() {

        let { song,lyric } = this.props;
        let d = player.duration();
        let btn_cd = this.computeBtnClass();
        let mode = this.computeModeClass();

        return (
            <div className="content music">

                <div className="head">
                    <div className="btn btn-down ignore" onClick={this.goBack.bind(this)}></div>
                    <div className="title"><span>{song.name}</span></div>
                    <div className="btn ignore"></div>
                </div>

                <div className="slider-wrap ignore">
                    <Slider>
                        <div className="page-1">
                            <div className="singer">
                                <span>{song.singer}</span>
                            </div>
                            <div className="cd ignore" style={{
                                transform:btn_cd.transform
                            }}>
                                <img className={btn_cd.cd} height={300} src={require("./1.png")} alt=""
                                    ref={(ref)=>{this.cd_img=ref}}
                                />
                            </div>
                                {/*<div className="mini-lyric">*/}
                                    {/*<p>曲:张不已</p>*/}
                                {/*</div>*/}
                        </div>

                        <Lyric
                            height={345}
                            //data={require("./lyric.json")}
                             data={{lyric}}
                            bind={player.bind}
                            unbind={player.unbind}
                        />
                    </Slider>
                </div>

                {/*唱片区域*/}
                {/* <div className="cd">
                    <img height={300} src={require("./1.png")} alt="" />
                </div> */}
                {/*<Lyric*/}
                    {/*data={{lyric}}*/}
                    {/*bind={player.bind}*/}
                    {/*unbind={player.unbind}*/}
                {/*/>*/}
                {/*迷你歌词*/}

                {/*播放控制区域*/}
                <div className="player-controller" id="controller">

                    {/*进度条*/}
                    <ProgressBar
                        handleEnd={(ratio) => {

                            player.setPos(d * ratio);
                        }}
                        duration={d}
                        currentTime={song.currentTime} />
                    {/*播放控制*/}
                    <div className="controller">
                        <div className={"btn ignore " + mode} onClick={() => {
                            this.props.changeMode();
                        }}> </div>
                        <div className="btn btn-pre  ignore" onClick={() => {
                            this.props.playNext(-1);
                        }}> </div>

                        <div className={"btn big ignore "+btn_cd.btn} onClick={() => {
                            this.computeCd();
                            this.props.play();
                        }}> </div>

                        <div className="btn btn-next ignore" onClick={() => {

                            this.props.playNext(1);
                        }}> </div>

                        <div className="btn btn-list ignore"> </div>
                    </div>
                    {/*收藏\分享\评论*/}
                    <div className="social">
                        <div className="btn">收藏</div>
                        <div className="btn">评论</div>
                    </div>
                </div>

            </div>

        );
    }
}

export default withRouter(connect(
    (state) => ({
        song: state.MusicReducer.song,
        status: state.MusicReducer.status,
        mode: state.MusicReducer.mode,
        lyric:state.MusicReducer.lyric,


    }),
    (dispatch) => ({
        play: () => dispatch(PlayerAction.play({})),
        updateTime: (t) => dispatch(PlayerAction.updateTime(t)),
        playNext: (type) => {
            dispatch(PlayerAction.playNext(type))
        },
        changeMode: () => {
            dispatch(PlayerAction.changeMode())
        },
        getLyric:(id)=>{
            dispatch(PlayerAction.getLyric(id))
        }

    })
)(MusicPlayer))

