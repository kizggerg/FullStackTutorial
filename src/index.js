import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';;

ReactDOM.render(
    <Router
        history={browserHistory}
        routes={Routes}
    >
    </Router>,
    document.getElementById('root'));

registerServiceWorker();
