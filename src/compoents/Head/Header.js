import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

import './index.css';


class Header extends Component {


    render() {
        return (
            <div className="header">
                <div className="header-tabs">
                    <Link to={"/"}>
                        <span>我的</span>
                    </Link>

                    <Link to={"/find"}>
                        <span>音乐馆</span>
                    </Link>
                </div>

                <div className="search">
                    <Link to={"/search"}>
                        <input type="text" placeholder="搜索" disabled={true}/>
                    </Link>
                </div>


            </div>

        );
    }
}

export default Header;
