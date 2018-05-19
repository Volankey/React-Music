import React, { Component } from 'react';
import {
    Link,withRouter
} from 'react-router-dom';

import './index.css';


class Header extends Component {
    constructor(props){
        super(props);
        this.renderItem = this.renderItem.bind(this);

            this.state ={
                navs: [
                    {
                        path: "/home",
                        name: "我的"
                    },
                    {
                        path: "/find",
                        name: "音乐馆"
                    },
                    {
                        path: "/search",
                        name: "搜索"
                    },

                ]
            }
    }
    renderItem(item,index){
        let ptn = this.props.location.pathname,
            current = "";

        current = ptn == item.path?"current":"";

        return (
            <Link to={item.path} key={item.path}>
                <span className={current}>{item.name}</span>
            </Link>
        )
    }
    render() {

        return (
            <div className="header">
                <div className="header-tabs">
                    {
                        this.state.navs.map(this.renderItem)
                    }
                </div>




            </div>

        );
    }
}

export default withRouter(Header);
