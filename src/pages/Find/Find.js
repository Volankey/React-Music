import React, { PureComponent } from 'react';
import { connect } from 'react-redux'; // 引入connect函数
import Slider from '../../compoents/Slider'
import List from '../../compoents/List'
import Immutable from "seamless-immutable";
import {
    Link
} from 'react-router-dom';
import './index.css';
import * as SongListAction from '../../actions/SongListAction';



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

                        data={this.props.data.list}
                        renderItem={(item,index)=>{
                            return (

                                <Link to={"/find/list/"+item.dissid} key={item.dissid}>
                                    <div  className="diss-item" key={item.dissid}>
                                        <img className="ignore" src={item.imgurl} alt=""/>
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
                                interval={5000}
                                seamless={true}>
                                {
                                    this.props.slider.map((item,index)=>{

                                        return (<a key={item.id} href={item.linkUrl}>
                                            <img  src={item.picUrl} alt=""/></a> )
                                    })
                                }
                            </Slider>
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
