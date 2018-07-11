

import React, { Component } from 'react';
import {
    withRouter
} from 'react-router-dom';
import { connect } from 'react-redux'; // 引入connect函数
import Immutable from "seamless-immutable";
import LocalList from '../../compoents/LocalList'
import * as PlayingListAction from "../../actions/PlayingListAction";
import "./index.css";


class RecentList extends Component {

    render() {
        return (
            <LocalList
                data={this.props.data}
                addToPlayingList={this.props.addToListPlayingList}
                play={this.props.addToPlayingList}
            />
        )
    }
}

export default withRouter(connect(
    (state) => ({
        data:state.PlayingListReducer.history,
        loading:state.PlayingListReducer.loading
    }),
    (dispatch) => ({
        addToListPlayingList: (data) => {

            function getSong(song) {
                return Immutable.asMutable(song);
            }
            dispatch(PlayingListAction.addListToPlayingList(data,getSong))
        },
        addToPlayingList:(song)=>{
            function getSong(song) {
                return Immutable.asMutable(song);
            }
            dispatch(PlayingListAction.addToPlayingList(song,getSong))
        }


    })
)(RecentList))

