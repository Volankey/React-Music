import React, { PureComponent } from 'react';


import MyPage from './MyPage/Mypage';
import Find from './Find/Find';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import Search from './Search/Search';
import Header from '../compoents/Head/Header';
import Player from '../compoents/Player/Player';
import PlayingList from '../compoents/PlayingList';
import CdList from './CdList';
import RecentList from './RecentList';

import {myplayer} from '../tools/Tools';
import * as TYPE from '../constants/PlayerType';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';


import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../actions/PlayerAction";
import * as PlayingListAction from "../actions/PlayingListAction";
import { CSSTransitionGroup } from 'react-transition-group' // ES6
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

                        <Route render={({ location }) => {
                            return(
                                <CSSTransitionGroup
                                    transitionName='player'
                                    transitionEnterTimeout={300}
                                    transitionLeaveTimeout={500}
                                >

                                    <div className="content-wrap" key={location.pathname}>
                                        <Route location={location}  path='/music'  component={MusicPlayer}/>
                                    </div>
                                </CSSTransitionGroup>
                            )
                        }}/>
                        <Route render={({ location }) => {
                            return(
                                <CSSTransitionGroup
                                    transitionName='left'
                                    transitionEnterTimeout={300}
                                    transitionLeaveTimeout={500}
                                >

                                    <div className="content-wrap" key={location.pathname}>
                                        <Route location={location}  path='/home/recent'  component={RecentList}/>
                                        <Route location={location} path='/home/list/:id' component={CdList}/>
                                        <Route location={location} path='/find/list/:id' component={CdList}/>
                                    </div>
                                </CSSTransitionGroup>
                            )
                        }}/>

                        <Route exact path="/" render={() => (
                            <Redirect path="/" exact to={{pathname: '/home'}} />
                        )}/>


                        <Route path='/home' component={MyPage}/>
                        <Route path='/find' component={Find}/>
                        <Route path='/search' exact component={Search}/>








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
