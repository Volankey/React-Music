import React, { PureComponent } from 'react';


import Header from '../compoents/Head/Header';
import Player from '../compoents/Player/Player';
import PlayingList from '../compoents/PlayingList';
import Routers from '../Routers';


import {myplayer} from '../tools/Tools';
import * as TYPE from '../constants/PlayerType';

import {
    BrowserRouter as Router,

} from 'react-router-dom';


import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../actions/PlayerAction";
import * as PlayingListAction from "../actions/PlayingListAction";

class Home extends PureComponent {
    
    componentDidMount() {


        var player = myplayer();

        player.bind("ended",()=>{
            this.props.playEnd();
        });
        player.bind("playing",()=>{
            this.props.onPlaying();
        });
        player.bind("pause",()=>{
            this.props.onPause();
        });
        player.bind("error",()=>{
            this.props.onError();
        })

    }
    render() {
        return (


                <Router basename="/my-app-music">
                    <div id="app">

                        <Header/>

                        {/*路由注册*/}
                        <Routers/>


                        <Player
                            status={this.props.status}
                            song={this.props.song}
                            play={this.props.play}
                            show={this.props.show}
                        />
                        <PlayingList
                            currentSongId={this.props.song.id}
                            playingList={this.props.playingList}
                            hide={this.props.hide}
                            show={this.props.showPlayingList}
                            mode={this.props.mode}
                            play={this.props.playById}
                            clear={this.props.clearPlayingList}
                            delete={this.props.deleteById}
                        />
                    </div>

                </Router>



        );
    }
}

export default connect(
    (state) => ({
        song:state.MusicReducer.song,
        status:state.MusicReducer.status,
        playingList:state.PlayingListReducer.playingList,
        showPlayingList:state.PlayingListReducer.show,
        mode:state.MusicReducer.mode

    }),
    (dispatch) => ({
        play: () => dispatch(PlayerAction.play({})),
        updateTime:(t)=>dispatch(PlayerAction.updateTime(t)),
        playEnd:()=>{
            dispatch(PlayerAction.playEnd())
        },
        onPause:()=>{
            dispatch(PlayerAction.statusChange(TYPE.STATUS_PAUSE))
        },
        onPlaying:()=>{
            dispatch(PlayerAction.statusChange(TYPE.STATUS_PLAYING))
        },
        onError:()=>{
            dispatch(PlayerAction.playEnd())
        },
        show:()=>{
            dispatch(PlayingListAction.show())
        },
        hide:()=>{
            dispatch(PlayingListAction.hide())
        },
        playById:(index)=>{
            dispatch(PlayerAction.playByIdx(index))
        },
        clearPlayingList:()=>{
            dispatch(PlayingListAction.clearList())
        },
        deleteById:(song)=>{
            dispatch(PlayingListAction.deleteById(song))
        },



    })
)(Home)
