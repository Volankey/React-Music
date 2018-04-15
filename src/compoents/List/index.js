import React, { PureComponent } from 'react';


import AlloyTouch from 'alloytouch/alloy_touch.css';
import Transform from 'css3transform';
import './index.css';


class List extends PureComponent {

    constructor(props){
        super(props);

    }

    componentWillUnmount(){
        this.destory();
    }
    destory(){

        this.alloyTouch && this.alloyTouch.destroy();

    }
    initScroller(){
        this.loaded = true;
        // this.wrapHeight = this.props.height;
        this.wrapHeight = this.wrap.parentNode.offsetHeight;
        this.scrollerHeight = this.scroller.offsetHeight;
        this.centerOffset = this.wrapHeight/2;

        let min = this.min = -this.scrollerHeight+this.wrapHeight;
        console.log(min);
        min=min>=0?0:min;
        Transform(this.scroller);
        this.alloyTouch = new AlloyTouch({
            touch:"#scorller-wrap",//反馈触摸的dom
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
            maxSpeed: 1.5, //不必需，触摸反馈的最大速度限制
            initialValue: 0,
            // // change:function(value){console.log(value)  },
            // touchStart:(evt, value)=>{ this.isMoving = true;  },
            // touchMove:function(evt, value){ evt.stopPropagation();  },
            // touchEnd:(evt,value)=>{
            //     if(this.timer)
            //         clearTimeout(this.timer);
            //
            //     this.timer = setTimeout(()=>{
            //         this.isMoving = false;
            //     },3000);
            //
            // },

        });

    }
    init(){

    }
    componentDidMount(){

        this.initScroller();

    }

    scrollTo(idx,dt=300){

        this.alloyTouch.to(this.offsetMap[idx],dt);

    }


    render() {

        console.log( this.props.children);
        return (
            <div  id="scorller-wrap" className="ignore"  ref={(ref)=>{this.wrap = ref}} >

                <div id="scroller-content" ref={(ref)=>{this.scroller = ref}}>
                    {

                        React.Children.map(this.props.children,(c)=>{
                            return c;
                        })
                    }
                    {
                        this.props.data.map((item,index)=>{
                            return this.props.renderItem(item,index);
                        })
                    }
                </div>



            </div>

        )


    }
}

export default List;
