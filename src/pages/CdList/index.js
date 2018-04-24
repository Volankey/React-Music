import React, { PureComponent } from 'react';
import { connect } from 'react-redux'; // 引入connect函数
import * as PlayerAction from "../../actions/PlayerAction";
import * as CDListAcrion from "../../actions/CDListAcrion";
import {
    withRouter
} from 'react-router-dom';
import List from '../../compoents/List'


import './index.css';

// import data from './d.json';
/*
*  原理 设置内部滚动的overflow:hidden=>inerhit，这样内容可以在超出list-warp部分显示出来,
*  然后 layer-wrap块 根据 滚动的change监听val设置layer-wrap对应的translateY的值，这样，超出部分的背景就是layer-wrap
*  判断 当前top（也就是滚动的长度）是否超过 header的位置 this.max记录这个阈值 超过则不再设置layer-wrap的translateY，此时应当设置图片的高度为40px，否则图片超过40px的部分会遮挡滚动的内容
*  stick来控制是否到达阈值
* */

//生成song数据
const getSong = (data)=>{

    let singgers =   data.singer.map(function (singer) {
        return singer.name
    }).join("-");

    let song = {
        name:data.title,
        singer:singgers,
        id:data.mid,
        album:data.album.mid,
        duration:data.interval,
        currentTime:0,

    };
    return song;
};

class CdList extends PureComponent {

    renderItem = (item,index)=>{
        let singers = item.singer.map(function (singer) {
            return singer.name;
        });
        singers = singers.join("/");
        return (
            <div className="diss-item" key={item.id} onClick={()=>{
                this.props.addToPlayingList(item,getSong);
            }}>

                <div className="intro">
                    <p className="ignore text-overflow">{item.title}</p>
                    <p className="ignore text-overflow">{singers+" · " +item.album.name}</p>
                </div>
            </div>
        )
    };
    renderContent = ()=>{
        // data.cdlist[0].songlist

        if(this.props.data.cdlist[0]!=undefined && this.props.data.cdlist[0].songlist){
            let data = this.props.data.cdlist[0].songlist;
            return (
                <List
                    //正在加载？
                    isloading={this.props.loading}
                    //溢出是否隐藏
                    overHidden={false}
                    //监听change
                    change={this.setTop}
                    //数据
                    end={this.props.loadMore}
                    data={data}
                    renderItem={this.renderItem}
                >
                </List>
            )
        }else{
            return (
                <p className="text-center">加载中..</p>
            )
        }

    };
    goBack() {
        this.props.history.goBack();
    }
    constructor(props){
        super(props);
        // console.log(data);
        this.setTop = this.setTop.bind(this);
        this.state={
            top:0,
            scale:1,
            data:{
                cdlist:[]
            }
        }
    }
    componentDidMount(){

        this.cdHeight= 300;
        this.titleHeight = 40;
        //layer-wrap最大translateY
        this.max = this.cdHeight-this.titleHeight;

        let id = this.props.match.params.id;
        id  && this.props.getData(id);
        // id && tools.fetch(
        //     {
        //         url:'http://'+domain+':3001/apis/list_data?id='+id,
        //         dataType:"json",
        //     }
        // ).then((res)=>{
        //     console.log(res);
        //     this.setState({
        //         data:Immutable(res)
        //     })
        // });

        // alert();

    }
    setTop(val){

        //是否到达顶部
        if(val+this.max>0){

            if(val>0){
                // console.log(val);
                //计算 cd图片的放大值
                let scale = val/240+1;
                this.setState({
                    scale
                })

            }
                this.setState({
                    top:val,
                    stick:false
                })
        }
        else{
            this.max && this.setState({
                top:-this.max,
                stick:true

            })
        }

    }
    render() {

        let data = this.props.data.cdlist;
        // data=data.length?data[0]:{};
        // console.log(data);
        let dissname ="加载中",
            logo = "";
        if(data[0]!=undefined){
            dissname = data[0].dissname;
            logo = data[0].logo;
        }

            // logo = data.logo?data.logo:"";

        let cd_style = {
            backgroundImage:"url("+logo+")"
            ,
            zIndex:this.state.stick?20:null,
            height:this.state.stick?40:300,
            transform:`scale(${this.state.scale})`
        };

        let display = this.state.stick?"none":"flex";
        return (

            <div className="content cd" ref={(r)=>{this.content = r;}}>
                {/*头部区域开始*/}
                <header>
                    <h2 className="ignore" ref={(ref)=>{this.title=ref}}>
                        {/*返回按钮*/}
                        <span className="back ignore" onClick={()=>{
                            this.goBack()
                        }}> </span>
                        <p className="ignore text-overflow">{dissname}</p>
                        <span> </span>
                    </h2>
                </header>
                {/*头部区域结束*/}
                {/*cd图片开始*/}
                <div className="cd-intro ignore" style={cd_style}>

                    <div className="filter">
                        <div style={{display}} className="btn-play-all ignore"><span>播放全部</span></div>
                    </div>
                </div>
                {/*cd图片结束*/}

                {/*背景遮罩 start*/}
                <div className="layer-wrap" style={{transform:"translateY("+this.state.top+"px)"}}> </div>
                {/*背景遮罩 end*/}

                {/*滚动列表*/}
                <div className="list-wrap ignore">
                    {
                        this.renderContent()
                    }
                </div>

            </div>

        );
    }
}
export default withRouter(connect(
    (state) => ({
        data:state.CDDataReducer.data,
        loading:state.CDDataReducer.loading
    }),
    (dispatch) => ({
        addToPlayingList: (data,getsong) => {
            dispatch(PlayerAction.addToPlayingList(data,getsong))
        },
        getData:(id)=>{
            dispatch(CDListAcrion.getData(id))
        },
        loadMore:()=>{
            dispatch(CDListAcrion.loadMore())
        }

    })
)(CdList))

