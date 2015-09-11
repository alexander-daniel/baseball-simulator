'use strict';

import React from 'react';
import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';
import appStoreMixin from './AppStore.mixin.js';

import PlateMatchup from './PlateMatchup.react';
import ScoreBoard from './ScoreBoard.react';
import Lineup from './Lineup.react';
import Field from './Field.react';

var AppContainer = React.createClass({
    getInitialState: function () {
        return this.getState();
    },

    mixins: [appStoreMixin],

    getState: function () {
        return {
            team: AppStore.getTeam(),
            currentGame: AppStore.getCurrentGame()
        };
    },

    _onChange: function () {
        this.setState(this.getState());
    },

    handleClick: function (team) {
        AppActions.readyMove(1, team);
    },

    getTeam: function () {
        AppActions.getTeam('dukes');
    },

    getCurrentGame: function () {
        AppActions.getCurrentGame('dukes');
    },

    render: function () {
        let game = this.state.currentGame;


        let gameInfo = (
            <div>
                <div>{'Current Inning: ' + game.currentInning}</div>
                <div>{'Outs: ' + game.numberOfOuts}</div>
                <div>{'At Bat: ' + game[game.atBat + 'Team']}</div>
            </div>
        );

        if (!this.state.currentGame.currentPlay) return null;

        let homeReady = game.currentPlay.home.ready;
        let awayReady = game.currentPlay.away.ready;

        let homeStyle = homeReady ? 'button button-primary' : 'button';
        let awayStyle = awayReady ? 'button button-primary' : 'button';

        return (
            <div className="container">

                <div className="row">
                    <div className="six columns +soft">
                        <ScoreBoard {...this.state}/>
                    </div>

                    <div className="three columns +soft">
                        <PlateMatchup {...this.state}/>
                        {gameInfo}
                    </div>

                    <div className="three columns +soft">
                        <span className="+push">
                            <a className={homeStyle} onClick={this.handleClick.bind(this, 'home')}>
                                {'ready ' + this.state.currentGame.homeTeam}
                            </a>
                        </span>

                        <span className="+push">
                            <a className={awayStyle} onClick={this.handleClick.bind(this, 'away')}>
                                {'ready ' + this.state.currentGame.awayTeam}
                            </a>
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="six columns">
                        {game[game.atBat + 'Team'] + ' : Lineup'}
                        <Lineup {...this.state} lineup={game.lineups[game.atBat]}/>
                    </div>
                    <div className="six columns">
                        <Field game={game}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AppContainer;
