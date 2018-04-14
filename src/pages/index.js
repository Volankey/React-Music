import React, { Component } from 'react';


import MyPage from './MyPage/Mypage';
import Find from './Find/Find';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import Search from './Search/Search';
import Header from '../compoents/Head/Header';
import Player from '../compoents/Player/Player';
import {myplayer} from '../tools/Tools';
import * as TYPE from '../constants/PlayerType';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';


import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../actions/PlayerAction";

class Home extends Component {
    
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
        })

    }
    render() {
        return (


                <Router>
                    <div id="app">
                        <Header/>

                        <Switch>
                            <Route path='/' exact component={MyPage}/>
                            <Route path='/find' exact component={Find}/>
                            <Route path='/search' exact component={Search}/>
                            <Route path='/music' exact component={MusicPlayer}/>
                        </Switch>

                        <Player song={this.props.song}/>
                    </div>

                </Router>



        );
    }
}

export default connect(
    (state) => ({
        song:state.MusicReducer.song,

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
        }


    })
)(Home)
