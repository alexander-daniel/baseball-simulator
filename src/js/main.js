'use strict';

import React from 'react';
import {Client} from 'agora';
import AppState from 'ampersand-app';
import AppContainer from './components/AppContainer.react.js';
import AppActions from './actions/AppActions';
import prepareDocument from './utils/prepareDocument';

AppState.extend({
    init: function () {

        prepareDocument({
            css: [
                //{ href: 'css/style.css' },
                //{ href: '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css' }
            ],
            favicon: { href: 'img/favicon.ico' },
            title: 'baseball sim'
        });

        this.client = new Client();

        this.client.on('ready', function (id) {
            AppActions.registerId(id);
            AppActions.logIn('dukes');
        });

        this.client.on('gotTeam', function (result) {
            AppActions.updateTeam(result);
        });

        this.client.on('currentGame', function (result) {
            AppActions.updateCurrentGame(result);
        });

        this.client.connect('ws://localhost:8000');
    }
});

React.render(<AppContainer />, document.getElementById('main'));
AppState.init();
