import React, { Component } from 'react';
import "./index.css"

/*
* props : seamless（是否支持无缝滚动）autoSlide（时间间隔自动滚动） interval(间隔时间)
* children:滚动的内容
* 目前暂时只能够横向滚动
* */
class Slider extends Component {

    constructor(props){
        super(props);
        this.handleStart=this.handleStart.bind(this);
        this.handleMove=this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        let dot = this.props.seamless?1:0;
        this.state={
            width:0,
            left:0,
            dot:dot
        }
    }
    componentWillUnmount(){
        clearTimeout(this.autoSlideTimer)
    }
    componentDidMount() {
        let len = this.len-1;
        len = (len>=0)?len:0;
        this.width = this.slider.offsetWidth;
        this.min = -this.width*len;

        this.idx = this.props.seamless?1:0;

        this.x = -this.idx*this.width;

        //如果是无缝滚动
        if(this.props.seamless && this.props.autoSlide===true){
            this.autoSlide();
        }


        this.setState({
            width:this.width,
            left:this.x
        });

        window.addEventListener("touchmove",this.handleMove);
        // this.slider.addEventListener("touchend",this.handleEnd);
    }
    autoSlide(){
        this.autoSlideTimer = setTimeout(()=>{

            if(!this.isMoving && !this.isAnimating){

                this.transitionDuration=300+"ms";
                let idx = this.idx +1 ;
                idx = idx % this.len;

                this.scrollTo(idx);

            }

            this.autoSlide();
        },this.props.interval);
    }
    handleStart(e){
        this.isMoving = true;
        this.isTracking = true;

        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.preX = this.startX;
        this.preY = this.startY;
        this.offset = 0;
        clearTimeout(this.autoSlideTimer);
        // alert("slider")
    }
    handleMove(e){
        console.log("slider");
        e.preventDefault();
        if(this.isTracking){
            let currentX = e.touches[0].clientX,
                currentY = e.touches[0].clientY;
            let deltaX = this.deltaX = currentX-this.preX,
                deltaY = this.deltaY = currentY-this.preY;
            let x =this.x;
            x+= deltaX;
            this.offset+=deltaX;


            // if(Math.abs(deltaY)>Math.abs(deltaX)){
            //     return;
            // }
            // e.stopImmediatePropagation();
            if(!this.props.seamless && (x>0 || x<this.min))
                return;

            this.x = x;

            let opacity = Math.abs(this.offset)/this.state.width;
            console.log("透明度",opacity);
            this.preX = currentX;
            this.transitionDuration=null;
            this.setState({
                left:this.x
            })
            // console.log(left);
        }


    }
    handleEnd(e){

        // console.log("slider");
        if(this.isTracking){
            // let endX = e.changedTouches[0].clientX,
            //     endY = e.changedTouches[0].clientY;

            let item_pos =-this.state.width*this.idx;
            let w = (item_pos-this.x);
            // let w = this.startX-endX;
            // let y = this.startY-endY;
            this.transitionDuration=300+"ms";


            console.log(w);



            // if(Math.abs(y)>Math.abs(w)+5){
            //
            //     this.x = item_pos;
            //     this.setState({
            //         left:this.x
            //     });
            //     this.isTracking=false;
            //     return;
            // }

            //左滑动
            if(w>0 && Math.abs(w)>20){
                let idx = this.idx+1;


                if(idx<this.len){
                    this.idx = idx;
                    this.x = -this.state.width*this.idx;


                }
                else{
                    this.x = -this.state.width*this.idx;
                }



            }
            else if(w<0 && Math.abs(w)>20){
                //右滑动
                let index = this.idx-1;

                if(index>=0){
                    this.idx = index;
                    this.x = -this.state.width*this.idx;
                    this.setState({
                        left:this.x
                    });
                } else{
                    this.x = -this.state.width*this.idx;
                }



            }
            else{
                this.x = item_pos;
            }
            this.scrollTo(this.idx);
            // this.setState({
            //     left:this.x
            // });
            this.isTracking=false;
            this.isMoving = false;
        }
        this.props.seamless && this.autoSlide();

    }
    computeStyle(){
        // let children = this.props.children && this.props.children;
        let w = this.len*this.state.width;
        w = isNaN(w)?0:w;
        let style = {
                width:w,
                transform:`translate(${this.state.left}px,0) translateZ(0px)`,
            };
        if(this.content)
            this.content.style.transitionDuration=this.transitionDuration;
        return style;

    }
    scrollTo(idx,isAnimating=true){
        this.isAnimating = isAnimating;
        this.idx=idx;
        this.x = -this.state.width*idx;
        let dot_idx = idx;
        if(this.idx===0){
            dot_idx = this.len-2;
        }
        else if(this.idx===this.len-1){
            dot_idx = 1;
        }

        this.setState({
            left:this.x,
            dot:dot_idx
        })
    }
    animateEnd(){
        if(this.isAnimating === true){
            this.isAnimating = false;

            this.transitionDuration=null;
            let idx = this.idx;

            if(this.idx===0){
                idx=this.len-2;
                //说明是源数据的最后一图
                this.scrollTo(idx,false);
            }
            else if(this.idx===this.len-1){
                idx=1;
                //说明是第一个图
                this.scrollTo(idx,false);
            }

        }

    }
    renderDots(){

        let dot = this.props.children.map((el,idx)=>{
            let k = this.props.seamless? idx + 1 : idx;
            if(this.state.dot === k)
               return (

                   <span className="dot active" key={k}></span>
               );
            else
                return(
                    <span className="dot" key={k}></span>
                )
        });

        return(
            <div className="dots" style={{
                bottom:this.props.dotBottom>=0?this.props.dotBottom:"10%"
            }}>
                {
                    dot
                }
            </div>
        )
    }
    renderItems(){
        let children = this.props.children && this.props.children;

        //返回内容（由li包裹的）
        let els = children.map(
            (el,idx)=>{

                return (
                    <li
                        key={idx}
                        style={{
                            width:this.state.width
                        }}
                    >
                        {el}
                    </li>

                );
            }
        );
        //如果是无缝滚动那么
        if(this.props.seamless && children.length>=2){
            //传入的可能不是一个数组，可能是伪数组比如immutable要进行一下转换
            els = Array.prototype.slice.apply(els);
            //将第一个内容push到最后完成最后一个内容和第一个内容无缝滚动
            els.push((<li  key={els.length} style={{width:this.state.width}}>
                {children[0]}
                     </li>));
            //同理 第一个和最后一个的无缝滚动
            els.unshift((<li key={-1} style={{width:this.state.width}}>
                {children[els.length-2]}
            </li>))
        }
        this.len = els.length;
        return els;
    }
    render() {


        let style = this.computeStyle();

        return (
            <div className="slider"
                 ref={(ref)=>{
                     this.slider = ref;
                 }}
                 onTouchStart={this.handleStart}
                 // onTouchMove={this.handleMove}
                 onTouchEnd={this.handleEnd}
            >
                <ul
                    ref={(ref)=>{this.content=ref;}}
                    id="slider-content"
                    onTransitionEnd={()=>{
                        this.animateEnd();
                    }}
                    style={style}
                >


                    {
                        this.renderItems()
                    }
                </ul>
                {
                    this.props.showDot && this.renderDots()
                }
            </div>



        );
    }
}
Slider.defaultProps = {
    autoSlide: true,
    interval:3000,
    seamless:false,
    showDot:false
};
export default Slider;
