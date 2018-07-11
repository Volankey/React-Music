import React, { PureComponent } from 'react';


import AlloyTouch from 'alloytouch/alloy_touch.css';
import Transform from 'css3transform';
import './index.css';


class List extends PureComponent {


    componentWillUnmount(){
        this.destory();
    }
    destory(){

        this.alloyTouch && this.alloyTouch.destroy();

    }
    initScroller(){

        this.loaded = true;
        // this.wrapHeight = this.props.height;
        this.wrapHeight = this.props.height || this.wrap.parentNode.offsetHeight;
        this.scrollerHeight = this.scroller.offsetHeight;
        this.centerOffset = this.wrapHeight/2;

        let min = this.min = -this.scrollerHeight+this.wrapHeight;
        // console.log(min);
        min=min>=0?0:min;
        Transform(this.scroller);
        this.alloyTouch = new AlloyTouch({
            touch:this.wrap,//反馈触摸的dom
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
            change:(v)=>{
                this.top=v;
                this.props.change && this.props.change(v);
                if(v < this.min-30){
                    if(this.props.end){
                        this.props.end();

                    }

                }
            },
            touchMove:function(evt, value){ evt.stopPropagation();  },


        });


    }
    componentWillReceiveProps(nextProps){
        let diff = nextProps.data.length - this.props.data.length;
        this.reCaculate = true;

        if(diff===0){
            this.reCaculate = false;
        }
    }
    componentDidUpdate(){

        //做一层优化
        //根据componentWillReceiveProps判断是否重新计算
        //因为当父元素更新的时候也会触发List更新获取offsetHeight会造成REFLOW
        if(this.reCaculate===true){
            this.scrollerHeight = this.scroller.offsetHeight;
            let min = -this.scrollerHeight+this.wrapHeight;
            //滚动到最上边
            if(min>this.min){
                this.scrollTo(0,0);
            }
            min < 0 ? this.min = this.alloyTouch.min=min:min;
            this.reCaculate=false;
        }

    }
    componentDidMount(){
        this.top=0;
        this.initScroller();
        this.loadMore=false;
    }

    scrollTo(pos,dt=300){

        this.alloyTouch.to(pos,dt);

    }


    render() {

        // console.log( this.props.children);
        let  overflow = this.props.overHidden===false?"initial":"hidden";
        return (
            <div style={{
                overflow:overflow
            }}   className="ignore scorller-wrap"  ref={(ref)=>{this.wrap = ref}} >

                <div className="scroller-content" ref={(ref)=>{this.scroller = ref}}>
                    {

                        React.Children.map(this.props.children,(c)=>{
                            return c;
                        })
                    }
                    {
                        this.props.data && this.props.data.map((item,index)=>{
                              return this.props.renderItem(item,index);
                        })
                    }
                    {/*{*/}
                        {/*this.props.data.length>0 && this.props.end && <p  className="text-center more">{*/}
                            {/*this.props.isloading==true?"加载中..":"上滑动加载更多"*/}
                        {/*}</p>*/}
                    {/*}*/}
                    <EndText
                        show={this.props.data.length>0 && this.props.end }
                        noMore={this.props.noMore}
                        isloading={this.props.isloading}
                    />
                </div>



            </div>

        )


    }
}
function EndText(props){
    if(!props.show){
        return null;
    }
    let text = "上滑加载更多";
    if(props.noMore===true){
        text = "没有更多了"
    }
    else if(props.isloading){
        text = "加载中.."
    }
    return  <p  className="text-center more">{text}</p>
}
List.defineProperties={
    overHidden:false
};
export default List;
