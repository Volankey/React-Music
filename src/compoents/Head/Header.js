import React, { PureComponent } from 'react';
import {
    Link
} from 'react-router-dom';

import './index.css';


class Header extends PureComponent {


    render() {
        return (
            <div className="header">
                <div className="header-tabs">
                    <Link to={"/home"}>
                        <span>我的</span>
                    </Link>

                    <Link to={"/find"}>
                        <span>音乐馆</span>
                    </Link>
                    <Link to={"/search"}>
                        <span>搜索</span>
                    </Link>
                </div>




            </div>

        );
    }
}

export default Header;
