'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import BaseStore from './BaseStore';
import AppConstants from '../constants/AppConstants';
import Collection from 'ampersand-collection';
import assign from 'object-assign';

var _team;
var _currentGame;

var AppStore = BaseStore.extend({

    getTeam: function () {
        return assign({}, _team);
    },

    getCurrentGame: function () {
        return assign({}, _currentGame);
    }

});

var actions = function(action) {
    switch(action.event) {

    case AppConstants.UPDATE_TEAM:
        _team = action.team;
        AppStore.emitChange();
        break;

    case AppConstants.UPDATE_CURRENT_GAME:
        _currentGame = action.currentGame;
        AppStore.emitChange();
        break;
    }
};

AppDispatcher.register(actions);
module.exports = AppStore;
