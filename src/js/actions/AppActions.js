'use strict';

import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatchers/AppDispatcher';
import AppState from 'ampersand-app';

var _id;

var AppActions = {

    registerId: function (id) {
        _id = id;
    },

    logIn: function (teamId) {
        AppState.client.emit('logIn', {
            websocketId: _id,
            teamId: teamId
        });
    },

    readyMove: function (gameId, team) {
        AppState.client.emit('readyMove', {
            gameId: gameId,
            team: team
        });
    },

    getTeam: function (teamId) {
        AppState.client.emit('getTeam', {
            teamId: teamId
        });
    },

    updateTeam: function (team) {
        AppDispatcher.dispatch({
            event: AppConstants.UPDATE_TEAM,
            team: team
        });
    },

    getCurrentGame: function (teamId) {
        AppState.client.emit('getCurrentGame', {
            teamId: teamId
        });
    },

    updateCurrentGame: function (currentGame) {
        AppDispatcher.dispatch({
            event: AppConstants.UPDATE_CURRENT_GAME,
            currentGame: currentGame
        });
    }

};

module.exports = AppActions;
window.AppActions = AppActions;
