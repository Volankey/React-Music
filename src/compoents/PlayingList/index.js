import React, { PureComponent } from 'react';
import * as TYPE from '../../constants/PlayerType'
import List from  '../List';


import './index.css';


// "inherit"

class PlayingList extends PureComponent {

    componentDidMount(){
        console.log(this.scroll)

        this.currentIndex=0;
        this.itemHeight =  document.querySelector(".playing-list-item").offsetHeight;



    }
    componentDidUpdate(){
        this.scroll.scrollTo(-this.itemHeight*this.currentIndex);

    }
    renderItem(item,index){

        let active = "";
        if(item.id == this.props.currentSongId){
            active="active"
            this.currentIndex = index;
        }

        return (
            <div className={"text-overflow playing-list-item "+active} key={item.id}>
                <p
                    onClick={(e)=>{
                        e.stopPropagation();
                        this.props.play(index)
                    }}
                    className="text-overflow info"
                >
                    <span className="song-title">{item.name}</span>
                    <span className="singer"> - {item.singer}</span>
                </p>
                <p className="operation">
                    <span>喜欢</span>
                    <span onClick={()=>{this.props.delete(item)}}>删除</span>
                </p>

            </div>
        )
    };
    computeStyle(){
        if(this.props.show==true){
            let {mode} = this.props;
            let s="";
            if(TYPE.SINGLE_LOOP === mode){
                s="单曲循环"
            }
            else if(TYPE.LIST_LOOP === mode){
                s ="顺序循环" ;
            }
            else{
                s="随机播放"
            }
            return {
                bgc:{
                    backgroundColor:"rgba(0,0,0,0.3)",
                    visibility:"initial",
                    opacity:1,

                },
                list:{
                    transform:"translate3d(0,0px,0)"
                },
                mode:s
            }
        }
        else{
            return {
                bgc:{
                    backgroundColor:"rgba(0,0,0,0)",
                    visibility:"hidden",


                },
                list:{
                    transform:"translate3d(0,100%,0)"
                },
                mode:""

            }
        }
    }

    render() {
        let style = this.computeStyle();
        // console.log(style);
        return (
            <div
                onClick={()=>{
                    this.props.hide();
                }}
                style={style.bgc}
                id="playing-list"
                className="ignore playing-list">


                <div style={
                    style.list
                } className="playing-list-wrap"
                     onClick={(e)=>{e.stopPropagation();}}
                >

                    <div className="playing-list-header">
                        <span>
                             {style.mode}({this.props.playingList.length}首)
                        </span>
                        <span onClick={this.props.clear}>
                            清空
                        </span>

                    </div>
                    <div className="playing-list-content">
                        <List
                            overHidden={false}
                            renderItem={this.renderItem.bind(this)}
                            data={this.props.playingList}
                            ref={(ref)=>{this.scroll=ref}}
                        />
                    </div>
                    <div className="btn-close" onClick={()=>{
                        this.props.hide()
                    }}>关闭</div>


                </div>



            </div>

        );
    }
}

export default PlayingList;