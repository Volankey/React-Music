import React, { PureComponent } from 'react';
import  {Provider} from 'react-redux';
// import logo from './logo.svg';
import './App.css';

import Home from './pages/index';

import configureStore from "./store/ConfiguerStore";

const  store = configureStore();

class App extends PureComponent {


    render() {
        return (
            <Provider  store = {store}>

                <Home/>

            </Provider>

        );
  }
}

export default App;
