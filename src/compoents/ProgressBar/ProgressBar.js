import React, { PureComponent } from 'react';



import './index.css';


class ProgressBar extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            ratio:0,
            max:0
        }

    }
    inint(){
        this.isMoving = false;
        this.maxWidth = this.progress.offsetWidth;
        this.offsetLeft = this.progress.offsetLeft;
        this.circleWidth = this.circle.offsetWidth/2;
        this.x = 0;

        document.querySelector('body').addEventListener("touchmove",(e)=>{
            this.handleTouchMove(e)
        },false);

        document.querySelector('body').addEventListener("touchend",(e)=>{
            this.handleTouchEnd(e)
        },false);
        this.setState({
            ratio:0,
            max:this.maxWidth
        });


    }
    componentDidMount(){
        this.inint();
    }
    computeTime(d,c){
        let currentT = this.getTimeStr(c);
        let durationT = this.getTimeStr(d);

        return {
            currentT,
            durationT
        }
    }
     getTimeStr(seconds){
        if(isNaN(seconds))
            return "00:00";
        seconds = Math.floor(seconds);
        let min = Math.floor(seconds/60),
            s   = Math.floor(seconds%60);
        min = min<10?("0"+min):min;
        s   = s<10?("0"+s):s;

        return min+":"+s;
    }
    handleTouchStart(e){
        console.log(e.touches);
        e.stopPropagation();
        if(e.touches.length === 1){


            this.isMoving = true;
            let {
                pageX,
                pageY
            } = e.touches[0];

            this.startX = pageX;
            this.startY = pageY;

            this.preX = this.startX;


        }
    }
    handleTouchMove(e){
        if(this.isMoving === true && e.touches.length === 1){

            if(isNaN(this.props.duration)){
                return;
            }

            let {
                pageX,
                pageY
            } = e.touches[0];

            let currentX = pageX;
            let currentY = pageY;

            //计算手指X方向偏移位置
            let deltaX = currentX - this.preX;

            //优化
            if(Math.abs(deltaX)<=10)
                return;

            let distX = this.x + deltaX;


            if(distX >= this.maxWidth){
                if(this.x === this.maxWidth)
                    return;
                distX = this.maxWidth;
            }

            else if(distX <=0 ){
                if(this.x === 0)
                    return;
                distX = 0;

            }

            console.log(distX);

            this.setState({
                ratio:distX/this.maxWidth
            },function () {

                this.x = distX;
                this.preX = currentX;
            });


        }
    }
    /*
    *   处理TouchEnd事件
    *   this.props.handleEnd param1:传入移动的比例
    *
    */
    handleTouchEnd(){
        if(this.isMoving === true)
        {

            this.isMoving = false;
            this.props.handleEnd(this.state.ratio);
        }
    }
    handleClick(e){
        if(isNaN(this.props.duration)){
            return;
        }
        let offsetX = e.pageX-this.offsetLeft;
        let ratio = offsetX/this.maxWidth;
        this.isMoving = true;

        let distX = offsetX;

        this.setState({
            ratio:ratio
        },function () {

            this.handleTouchEnd();


            this.x = distX;

        });


        e.stopPropagation();
    }
    render() {
        let {
            duration,
            currentTime
        }   =  this.props;




        let ratio = currentTime/duration;


        if(this.isMoving){

            ratio = this.state.ratio;
            currentTime = ratio*duration;

        }
        else{
            this.x = ratio*this.maxWidth;
        }
        let w = ratio*this.maxWidth;

        let {currentT,durationT}=this.computeTime(duration,currentTime);


        w=isNaN(w)?0:w;
        console.log(w);
        let circle = w-this.circleWidth;
        // console.log(w,ratio,circle);

        return (

                <div className="progress-content"

                >

                    <div className="progress"
                         data-current={currentT}
                         data-duration={durationT}
                         ref={(ref)=>{this.progress = ref;}}
                         onClick={(e)=>{
                             this.handleClick(e);
                         }}
                    >

                        {/*<div className="loading-bar"></div>*/}
                        <div
                            className="progress-bar"

                            style={{
                                 width:(w)+"px"

                            }}>

                            <span className="circle"
                                  ref={(ref)=>{this.circle = ref;}}
                                  style={{
                                      transform:`translateX(${circle}px)`
                                  }}
                                  onTouchStart={(e)=>{
                                      this.handleTouchStart(e);
                                  }}


                            ></span>
                        </div>


                    </div>

                </div>
        );
    }
}

export default ProgressBar;
