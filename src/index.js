import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import { whyDidYouUpdate } from 'why-did-you-update';
// if (process.env.NODE_ENV !== 'production') {
//     whyDidYouUpdate(React);
// }
ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
