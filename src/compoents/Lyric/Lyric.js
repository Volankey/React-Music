import React, { PureComponent } from 'react';

import {
    Link,withRouter
} from 'react-router-dom';
import AlloyTouch from 'alloytouch/alloy_touch.css';
import Transform from 'css3transform';
import './index.css';

const content = (lyric)=>{
    let render;
    if(lyric){
        render = lyric.map( (item,idx) =>{


            return (
                <p
                    key={idx}
                    id={"line_"+idx}
                >{item.context}
                </p>
            )
        })
    }
    else{
        render = (
            <div className="no-lyric">
                <span>本歌曲暂时没有歌词</span>
            </div>
        )
    }

    return render;

};
class Lyric extends PureComponent {
    parseLyric(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        var lines = [];
        for(var i=0;i<lyrics.length;i++){
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr){
                continue;
            }
            var clause = lyric.replace(timeReg,'');
            for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;

                if(clause!=""){
                    lrcObj = {
                        time,
                        context:clause
                    };
                    lines.push(lrcObj);
                }
            }

        }
        console.log(lines);
        this.lyrics = lines;
        return lines;
    }
    constructor(props){
        super(props);
        this.state={};
        this.updateTime = this.updateTime.bind(this);
    }
    componentWillUnmount(){
        this.destory();
    }
    destory(){
        //解除绑定
        this.props.unbind("timeupdate",this.updateTime);
    }
    initScroller(){
        this.wrapHeight = this.props.height;
        this.scrollerHeight = this.scroller.offsetHeight;
        this.centerOffset = this.wrapHeight/2;

        let min = this.min = -this.scrollerHeight+this.wrapHeight-20;
        console.log(min);
        min=min>=0?0:min;
        Transform(this.scroller);
        this.alloyTouch = new AlloyTouch({
            touch:"#lyric",//反馈触摸的dom
            vertical: true,//不必需，默认是true代表监听竖直方向touch
            target: this.scroller , //运动的对象
            property: "translateY",  //被运动的属性
            min: min, //不必需,运动属性的最小值
            max: 0, //不必需,滚动属性的最大值
            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: 1,//不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1
            moveFactor: 1,//不必需,表示touchmove位移与被运动属性映射关系，默认值是1
            step: 1,//用于校正到step的整数倍
            bindSelf: false,
            maxSpeed: 2, //不必需，触摸反馈的最大速度限制
            initialValue: 0,
            // change:function(value){console.log(value)  },
            touchStart:(evt, value)=>{ this.isMoving = true; },
            // touchMove:function(evt, value){  },
            touchEnd:(evt,value)=>{
                if(this.timer)
                    clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.isMoving = false;
                },3000);

            },
            // tap:function(evt, value){  },
            // pressMove:function(evt, value){  },
            // animationEnd:(value)=>{
            //     this.isMoving = false;
            // } //运动结束
        });

    }
    init(){
        this.destory();
        //在这里执行绑定
        this.props.bind("timeupdate",this.updateTime);

        let lyric = this.props.data.lyric;

        if(lyric){

            lyric = this.parseLyric(lyric);
            this.preIdx=0;
            this.offsetMap={};

        }
        this.setState ({
                lyric :lyric
            },
            this.initScroller.bind(this)
        );






    }
    componentDidMount(){

        this.init();

    }
    scrollTo(idx,dt=300){

        if(idx != this.preIdx){

            let el = document.querySelector("#line_"+idx),
                preEl = document.querySelector("#line_"+this.preIdx);

            if(!this.offsetMap[idx]){

                let top = -el.offsetTop+this.centerOffset;

                this.offsetMap[idx] = top;
                if(top<this.min)
                    this.offsetMap[idx]=this.min;


            }
            // console.log(this.isMoving);
            if(!this.isMoving)
                this.alloyTouch.to(this.offsetMap[idx],dt);

            el.classList.add("on");
            preEl.classList.remove("on");
            console.log(this.offsetMap[idx]);
            this.preIdx = idx;
        }

    }
    updateTime(e){
        let currentTime = e.target.currentTime;
        if(this.alloyTouch){


            let time = Math.floor(currentTime),
                lines = this.lyrics;

            for(var i = 0,max = lines.length; i<max;  i++){
                //如果当前时间小于该行的时间那么我们应该滑动到他的上一行
                if(lines[i].time>time){
                    break;
                }
            }
            var  index = i-1;
            this.scrollTo(index);
        }


    }

    render() {


        return (
            <div  id="lyric" className="ignore"  ref={(ref)=>{this.wrap = ref}} >

                <div id="scroll" ref={(ref)=>{this.scroller = ref}}>
                    {
                        content(this.state.lyric)
                    }

                </div>



            </div>

        );
    }
}

export default Lyric;
