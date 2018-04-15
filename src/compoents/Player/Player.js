import React, { Component } from 'react';

import {
    withRouter
} from 'react-router-dom';

import * as TYPE from '../../constants/PlayerType';
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
    computeBtnClass() {
        let status = this.props.status;


        if (status === TYPE.STATUS_PLAYING) {
            return "btn-pause";

        }
        else {

            return "btn-play";
        }

    }
    render() {
        let song = this.props.song;
        return (
            <div  id="player">

                    <div className="left" onClick={this.goDetail.bind(this)}>

                        <div className="pic">
                            <div className="pic ignore"  style={{backgroundImage:"url("+song.album+")"}}></div>
                        </div>
                        <div className="info">
                            <p>{song.name}</p>
                            <p className="singer">{song.singer}</p>
                        </div>
                    </div>


                <div className="btns">
                    <div className={"btn ignore "+this.computeBtnClass()}
                         onClick={()=>{this.props.play()}}
                    > </div>
                    <div className="btn ignore btn-list"></div>
                </div>


            </div>

        );
    }
}

export default withRouter(Player);
