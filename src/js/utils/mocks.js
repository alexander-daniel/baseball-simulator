'use strict';

var AppConstants = require('../constants/AppConstants');
var eden = require('node-eden');
var assignDeep = require('assign-deep');

function mockLineup () {
    var lineup = {};

    for (var i = 0; i < 9; i ++) {

        var statSpec = {};

        AppConstants.STAT_CATEGORIES.forEach((category) => {
            statSpec[category] = 0;
        });

        lineup[i + 1] = {
            name: eden.adam(),
            battingOrder: i + 1,
            isBatting: false,
            gameStats: statSpec
        };

    }

    return lineup;
}

function mockPitcher (opts) {
    var pitcher = assignDeep({}, {
        name: 'Marcus',
        throws: 'right'
    }, opts);

    return pitcher;
}

function mockGame () {

    var gameSpec = {
        gameId: 1,
        atBat: null,
        currentPlay: {
            home: {
                ready: false
            },
            away: {
                ready: false
            }
        },
        result: {
            home: 0,
            visitor: 0,
            winner: null
        },
        scoreBoard: {
            home: [0,0,0,0,0,0,0,0,0],
            away: [0,0,0,0,0,0,0,0,0]
        },
        lineups: {
            homeActiveBatterIndex: 1,
            awayActiveBatterIndex: 1,
            home: mockLineup(),
            away: mockLineup()
        },
        currentInning: 1,
        numberOfOuts: 0,
        pitchers: {
            home: mockPitcher(),
            away: mockPitcher()
        },
        currentPitcher: null,
        currentBatter: null,
        baseRunners: {
            first: {
                name: null
            },
            second: {
                name: null
            },
            third: {
                name: null
            }
        },
        homeTeam: 'Dukes',
        awayTeam: 'StLouis'
    };

    return gameSpec;
}

exports.mockGame = mockGame;
exports.mockLineup = mockLineup;
exports.mockPitcher = mockPitcher;
