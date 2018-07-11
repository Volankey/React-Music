import React,{ Component } from 'react';
import ReactDOM from  'react-dom';
import './Portal.css';


export default function Portal(WrappedComponent) {
    return class extends Component{
        constructor(props){
            super(props);
            //直接插入dom节点到body下
            if(!this.node){
                this.node = document.createElement("div");

                document.body.appendChild(this.node);
            }

        }
        //组件即将卸载时候删除dom节点
        componentWillUnmount(){
            this.node && this.node.remove();

        }
        //渲染内容
        renderContent(){

            return (
                <div>
                    {/*<div className="portal-bgc" onClick={this.props.hide}/>*/}
                    {/*给WrappedComponent传递props*/}
                    <WrappedComponent {...this.props    }/>
                </div>
            )
        }

        render(){
            const { visible} = this.props;

            //visible控制显示/隐藏
            if(visible)
                return (
                    this.node && ReactDOM.createPortal(this.renderContent(),this.node)

                )
            else
                return null;
        }
    }
}