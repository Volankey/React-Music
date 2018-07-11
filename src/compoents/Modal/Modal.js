import React,{ Component } from 'react';
import Portal from '../Portal/Portal'
import './Modal.css';

class Modal extends  Component{
    onOK = ()=>{
        this.props.onOK();
        this.props.hide();
    };
    onCancel = ()=>{
        this.props.onCancel();
        this.props.hide();
    };

    render(){
        const {hide,visible,style,className,title,onOK,onCancel} = this.props;
        //合并style
        let newStyle = Object.assign({},style,{
            display:visible?"block":"false",
        });
        return (
            <div
                style={newStyle}
                className={"modal-content "+ className}>
                <h4 className="clearfix">
                    {title}
                    <b className="close " onClick={hide}>关闭</b>
                </h4>
                {this.props.children && this.props.children}



                <div className="modal-btn">
                    {/*不显示没有对应方法的按钮*/}
                     {onCancel?<span onClick={this.onCancel}>取消</span>:null}
                     {onOK?<span onClick={this.onOK}>确定</span>:null}
                </div>


            </div>
        )
    }
}
//注意使用高阶组件进行装饰
export default  Portal(Modal)