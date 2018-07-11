# Portal
Portals 提供了一种很好的将子节点渲染到父组件以外的 DOM 节点的方式。
```
ReactDOM.createPortal(child, container)
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或碎片。第二个参数（container）则是一个 DOM 元素。

# 实践
> 自己写的一个实践，实现弹出modal,利用createPortal，以及高阶组件，如有不妥，请多提意见，谢谢！

### 高阶组件需要抽象出什么？

思考一个弹出窗口需要具备什么

- 需要外部提供props.visible来确定 隐藏/显示
- 需要在body下创建dom节点并将Portal插入到里面
- 需要在Protal.componentWillUnmount时删除创建的dom节点
- 需要外部提供props.hide、props.show 两个方法
- 需要将props传递给子组件
- 点击背景可以隐藏

### Do It
#### 高阶组件Portal

```
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
                    <div className="portal-bgc" onClick={this.props.hide}/>
                    {/*给WrappedComponent传递props*/}
                    <WrappedComponent {...this.props}/>
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

```
#### Modal
##### 思考我们需要什么功能？

- 可以自ok按钮和cancel按钮,执行props.ok/props.cancel
- 可以props.title 定义标题
- 标题最右边有关闭按钮
- 有内容渲染 且与Modal无关
- 支持自定义的className 和 style，props传递

思考后可以写出如下代码

```
import React,{ Component } from 'react';
import Portal from './Portal'
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

```


#### APP.js调用

```
class App extends Component {
 
    state={
        visible:false,
        hello:"hello world"
    };

    hide = ()=>{
        this.setState({
            visible:false
        })
    };
    ok = ()=>{
      console.log("ojbk")
    };
    cancel = ()=>{
        console.log("cancel")
    };
    toggleVis = ()=>{
        this.setState({
            visible:!this.state.visible
        })
    };
  render() {
    return (
      <div className="App">

          {/*{this.state.show?<MyComponent name="123"/>:""}*/}

          {/*<button onClick={()=>{*/}
            {/*this.setState({*/}
                {/*show:!this.state.show*/}
            {/*})*/}
          {/*}}>装载/卸载</button>*/}

        <Modal
            // 自定义的style
            style={{
                color:"#666",
                padding:10,
                paddingTop:0,
                borderRadius:8,
                display:"block"
            }}
            visible={this.state.visible}
            hide={this.hide}
            onOK={this.ok}
            onCancel={this.cancel}
            title="温馨提示"
        >
            <p>快乐每一天</p>
            <p>我是小白</p>

            <button onClick={()=>{
                alert(this.state.hello)
            }}>
                say hello
            </button>

        </Modal>
        <button onClick={this.toggleVis}>显示/隐藏</button>
      </div>
    );
  }
}

export default App;
```

#### 至此，我们有了一个可以高度扩展的Modal啦，你更可以基于Portal的装饰，写绝大多数的在页面弹出的东东，发挥你的创造力吧