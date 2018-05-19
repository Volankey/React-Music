import React, { PureComponent } from 'react';
import { connect } from 'react-redux'; // 引入connect函数
import Slider from '../../compoents/Slider'
import List from '../../compoents/List'


import {
    Link
} from 'react-router-dom';
import './index.css';
import * as SongListAction from '../../actions/SongListAction';
import LazyLoad, {forceCheck} from 'react-lazyload';
import PlaceHolderImage from '../../compoents/PlaceHolderImage'

class Find extends PureComponent {

    constructor(props){
        super(props);
        // console.log(data);
    }
    componentDidMount(){
        this.props.getData();

    }
    render() {
        return (

            <div className="content find ignore" ref={(r)=>{this.content = r;}}>

                <div className="list-wrap ignore">
                    <List
                        // 根据react-lazyload文档，需要这么做才会监听到translate的滚动
                        change={()=>{forceCheck();}}
                        data={this.props.data.list}
                        renderItem={(item,index)=>{
                            return (

                                <Link to={"/find/list/"+item.dissid} key={item.dissid}>
                                    <div  className="diss-item" key={item.dissid}>
                                        {/*懒加载*/}
                                        <LazyLoad height={60} placeholder={PlaceHolderImage(60,60)}>
                                            <img className="ignore" src={item.imgurl} alt=""/>
                                        </LazyLoad>
                                        <div className="intro">
                                            <p>{item.dissname}</p>
                                            <p>{item.creator.name}</p>
                                        </div>
                                    </div>
                                </Link>

                            )
                        }}
                    >
                        <div className="slider-wrap ignore">
                            <Slider
                                showDot={true}
                                interval={5000}
                                seamless={true}>
                                {
                                    this.props.slider.map((item,index)=>{

                                        return (<a  key={item.id} href={item.linkUrl}>
                                            <img  src={item.picUrl} alt=""/>
                                        </a> )
                                    })
                                }
                            </Slider>
                        </div>
                        <div className="diss-item">
                            歌单推荐
                        </div>

                    </List>
                </div>

            </div>

        );
    }
}

export default connect(
    (state) => ({
        data:state.SongListDataReducer.data,
        loading:state.SongListDataReducer.loading,
        slider:state.SongListDataReducer.slider
    }),
    (dispatch) => ({
        getData:()=>{
            dispatch(SongListAction.getData())
        },

    })
)(Find)
