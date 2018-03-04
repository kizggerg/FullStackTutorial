import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Template from '../containers/Template';
import TicTacToe from '../containers/TicTacToe';
import Profile from '../containers/Profile';
import Relay from 'react-relay/classic';

const ViewerQueries = {
    viewer: () => Relay.QL`query { viewer }`
}

const createRoutes = () => {
    return (
        <Route
            path='/'
            component={Template}
            queries={ViewerQueries}    
        >
            <IndexRoute
                component={TicTacToe}
                queries={ViewerQueries}
            />

            <Route
                path={'/profile'}
                component={Profile}
                queries={ViewerQueries}
            />

        </Route>
    );
}

const Routes = createRoutes();

export default Routes;