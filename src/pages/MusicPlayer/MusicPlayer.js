import React, { Component } from 'react';
import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../../actions/PlayerAction";
import * as PlayingListAction from "../../actions/PlayingListAction";

import { myplayer } from '../../tools/Tools'
import ProgressBar from '../../compoents/ProgressBar/ProgressBar';
import * as TYPE from '../../constants/PlayerType';
import Lyric from '../../compoents/Lyric/Lyric';
import Slider from '../../compoents/Slider';

import './index.css';

import {
     withRouter
} from 'react-router-dom';
var player = myplayer();
class MusicPlayer extends Component {

    goBack() {

        this.props.history.goBack();
    }
    onloadstart(){
        console.log(this.props.song.name);
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
                btn:"bg-pause-big",
                cd:"play",
                transform:this.cd_wrap_transform
            }
        }
        else {

            return {
                btn:"bg-play-big",
                cd:"",
                transform:this.cd_wrap_transform
            }
        }

    }
    computeModeClass() {
        let mode = this.props.mode;
        if (mode === TYPE.LIST_LOOP)
            return "bg-loop";
        else if (mode === TYPE.SINGLE_LOOP)
            return "bg-singleloop";
        else
            return "bg-random";
    }
    computeCd(){
        if(this.cd_img){
            let transform = getComputedStyle(this.cd_img).transform;
            transform = transform=="none"?"":transform;
            this.cd_wrap_transform = this.cd_wrap_transform.concat(" ",transform);
        }
    }
    shouldComponentUpdate(nextProps){
        if(this.props.lyric!=nextProps.lyric){

            return false;
        }

        return true;
    }
    render() {

        let { song,lyric } = this.props;
        let d = song.duration;
        let btn_cd = this.computeBtnClass();
        let mode = this.computeModeClass();

        // console.log(d);
        return (

            <div className="content music">
              
                <div className="background ignore" style={
                    {
                        backgroundImage:"url('"+song.albumUrl+"')"
                    }
                }>
                    {/*<img className="image" src={≈} alt=""/>*/}
                </div>
               {/*头部区域-开始*/}
                <div className="head">
                    <div className="btn bg-down ignore" onClick={this.goBack.bind(this)}></div>
                    <div className="title text-overflow"><span>{song.name}</span></div>
                </div>
                {/*头部区域-结束*/}

                {/*滑动区域，歌词/cd转动-开始*/}
                <div className="slider-wrap ignore">
                    <Slider
                        showDot={true}
                        dotBottom={-20}
                    >
                        <div className="page-1">
                            <div className="singer">
                                <span>{song.singer}</span>
                            </div>
                            <div className="cd ignore" style={{
                                transform:btn_cd.transform
                            }}>
                                <img className={btn_cd.cd} height={300} src={song.albumUrl} alt=""
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
                {/*滑动区域，歌词/cd转动-结束*/}

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
                        <div className="btn bg-playPreview  ignore" onClick={() => {
                            this.props.playNext(-1);
                        }}> </div>

                        <div className={"btn big ignore "+btn_cd.btn} onClick={() => {
                            this.computeCd();
                            this.props.play();
                        }}> </div>

                        <div className="btn bg-playNext ignore" onClick={() => {

                            this.props.playNext(1);
                        }}> </div>

                        <div className="btn bg-list ignore" onClick={this.props.show}> </div>
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
        play: () => dispatch(PlayerAction.play()),
        updateTime: (t) => dispatch(PlayerAction.updateTime(t)),
        playNext: (type) => {

            dispatch(PlayerAction.playNext(type))
        },
        changeMode: () => {
            dispatch(PlayerAction.changeMode())
        },
        getLyric:(id)=>{
            dispatch(PlayerAction.getLyric(id))
        },
        show:()=>{
            dispatch(PlayingListAction.show())
        },

    })
)(MusicPlayer))

