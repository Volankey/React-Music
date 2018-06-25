import RecentList from "./pages/RecentList";
import MusicPlayer from "./pages/MusicPlayer/MusicPlayer";
import Find from "./pages/Find/Find";
import MyPage from "./pages/MyPage/Mypage";
import Search from "./pages/Search/Search";
import CdList from "./pages/CdList";
import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
const Routers = ()=>{
    return (
        <React.Fragment>
            <Route render={({ location }) => {
                return(
                    <CSSTransitionGroup
                        transitionName='player'
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={500}
                    >

                        <div className="content-wrap" key={location.pathname}>
                            <Route location={location}  path='/music'  component={MusicPlayer}/>
                        </div>
                    </CSSTransitionGroup>
                )
            }}/>
            <Route render={({ location }) => {
                return(
                    <CSSTransitionGroup
                        transitionName='left'
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={500}
                    >

                        <div className="content-wrap" key={location.pathname}>
                            <Route location={location}  path='/home/recent'  component={RecentList}/>
                            <Route location={location} path='/home/list/:id' component={CdList}/>
                            <Route location={location} path='/find/list/:id' component={CdList}/>
                        </div>
                    </CSSTransitionGroup>
                )
            }}/>

            <Route exact path="/" render={() => (
                <Redirect path="/" exact to={{pathname: '/home'}} />
            )}/>


            <Route path='/home' component={MyPage}/>
            <Route path='/find' component={Find}/>
            <Route path='/search' exact component={Search}/>
        </React.Fragment>

    )
};
export default Routers;