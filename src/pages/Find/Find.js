import React, { Component } from 'react';

import Slider from '../../compoents/Slider'
import List from '../../compoents/List'
import {tools} from '../../tools/Tools'
import domian from '../../tools/domian'
import './index.css';

import data from './d.json';
class Find extends Component {

    constructor(props){
        super(props);
        console.log(data);
    }
    componentDidMount(){

    }
    render() {
        return (

            <div className="content find" ref={(r)=>{this.content = r;}}>

                <List

                    data={data.data.list}
                    renderItem={(item,index)=>{
                        return (
                            <div className="diss-item" key={item.dissid}>
                                <img className="ignore" src={item.imgurl} alt=""/>
                                <div className="intro">
                                    <p>{item.creator.name}</p>
                                    <p>{item.dissname}</p>
                                </div>
                            </div>
                        )
                    }}
                >
                    <div className="slider-wrap ignore">
                        <Slider seamless={true}>
                            <img src="https://y.gtimg.cn/music/photo_new/T003R720x288M000002tegZM3M9s88.jpg?max_age=2592000" alt=""/>
                            <img src="https://y.gtimg.cn/music/photo_new/T003R720x288M000000HA9Sn3blPws.jpg?max_age=2592000" alt=""/>
                            <img src="https://y.gtimg.cn/music/photo_new/T003R720x288M000003zOYtr0XJ0iN.jpg?max_age=2592000" alt=""/>
                            <img src="https://y.gtimg.cn/music/photo_new/T003R720x288M000000NUcZh2V2e8F.jpg?max_age=2592000" alt=""/>
                        </Slider>
                    </div>
                    

                </List>
            </div>

        );
    }
}

export default Find;
