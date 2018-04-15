import React, { Component } from 'react';
import "./index.css"

class Slider extends Component {

    constructor(props){
        super(props);
        this.handleStart=this.handleStart.bind(this);
        this.handleMove=this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.state={
            width:0,
            left:0
        }
    }

    componentDidMount() {
        let len = this.len-1;
        len = (len>=0)?len:0;
        this.width = this.slider.offsetWidth;
        this.min = -this.width*len;

        this.idx = this.props.seamless?1:0;

        this.x = -this.idx*this.width;


        this.setState({
            width:this.width,
            left:this.x
        });

        window.addEventListener("touchmove",this.handleMove);
        // this.slider.addEventListener("touchend",this.handleEnd);
    }
    handleStart(e){
        this.isMoving = true;
        this.isTracking = true;

        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.preX = this.startX;
        this.preY = this.startY;
        this.offset = 0;
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
        }

    }
    computeStyle(){
        // let children = this.props.children && this.props.children;
        let w = this.len*this.state.width;
        w = isNaN(w)?0:w;
        let style = {
                width:w,
                transform:`translate(${this.state.left}px,0)`,
            };
        if(this.content)
            this.content.style.transitionDuration=this.transitionDuration;
        return style;

    }
    scrollTo(idx){
        this.isAnimating = true;
        this.idx=idx;
        this.x = -this.state.width*idx;
        this.setState({
            left:this.x
        })
    }
    animateEnd(){
        if(this.isAnimating === true){
            this.isAnimating = false;

            this.transitionDuration=null;
            if(this.idx===0){

                //说明是源数据的最后一图
                this.scrollTo(this.len-2);
            }
            else if(this.idx===this.len-1){

                //说明是第一个图
                this.scrollTo(1);
            }
        }

    }
    renderItems(){
        let children = this.props.children && this.props.children;

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
        //无缝
        if(this.props.seamless){
            els.push((<li  key={els.length} style={{width:this.state.width}}>
                {children[0]}
                     </li>));
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
            </div>



        );
    }
}

export default Slider;
