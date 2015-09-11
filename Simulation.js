'use strict';

var rollDie = require('./src/js/utils/simulationUtils').rollDie;
var getClearedBases = require('./src/js/utils/simulationUtils').getClearedBases;
var getBattingTeam = require('./src/js/utils/simulationUtils').getBattingTeam;

function Simulation (game) {
    var simulator = {
        game: game,
        recordOut: function () {
            var currentBatter = this.getCurrentBatter();
            currentBatter.gameStats.AB += 1;
            game.numberOfOuts += 1;
            return this;
        },
        scoreRun: function (baseRunner) {
            console.log(baseRunner);
            baseRunner.gameStats.R += 1;
            console.log(baseRunner);
        },
        recordSingle: function () {
            var currentBatter = this.getCurrentBatter();
            currentBatter.gameStats.AB += 1;
            currentBatter.gameStats.H += 1;

            var onFirst = (game.baseRunners.first !== {});
            var onSecond = (game.baseRunners.second !== {});
            var onThird = (game.baseRunners.third !== {});

            if (!onFirst) {
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst  && !onSecond) {
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst && onSecond && !onThird) {
                game.baseRunners.third = game.baseRunners.second;
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst && onSecond && onThird) {
                this.scoreRun(game.baseRunners.third);
                game.baseRunners.third = game.baseRunners.second;
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            }

            return this;
        },
        recordWalk: function () {

            var currentBatter = this.getCurrentBatter();
            currentBatter.gameStats.BB += 1;

            var onFirst = (game.baseRunners.first !== {});
            var onSecond = (game.baseRunners.second !== {});
            var onThird = (game.baseRunners.third !== {});

            if (!onFirst) {
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst  && !onSecond) {
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst && onSecond && !onThird) {
                game.baseRunners.third = game.baseRunners.second;
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            } else if (onFirst && onSecond && onThird) {
                this.scoreRun(game.baseRunners.third);
                game.baseRunners.third = game.baseRunners.second;
                game.baseRunners.second = game.baseRunners.first;
                game.baseRunners.first = game.currentBatter;
            }

            return this;
        },
        getCurrentBatter: function () {
            var game = this.game;
            var currentLineup = game.lineups[game.atBat];
            var currentBatterIndex = game.lineups[game.atBat + 'ActiveBatterIndex'];

            // TODO: Hook into Players Table to get real stats
            return currentLineup[currentBatterIndex];
        },

        getCurrentBatterIndex: function () {
            var game = this.game;
            return game.lineups[game.atBat + 'ActiveBatterIndex'];
        },

        getCurrentLineup: function () {
            var game = this.game;
            return game.lineups[game.atBat];
        },
        unReadyTeams: function () {
            this.game.currentPlay.home.ready = false;
            this.game.currentPlay.away.ready = false;
        },
        simulatePlay: function () {

            console.log('SIMULATING');

            switch(rollDie(3)) {
                case 1:
                    this.recordOut();
                    break;
                case 2:
                    this.recordSingle();
                    break;
                case 3:
                    this.recordWalk();
                    break;
            }

        },
        changeInning: function () {

            var game = this.game;

            if (game.numberOfOuts < 3) return;

            game.currentInning += 0.5;
            game.numberOfOuts = 0;
            game.atBat = getBattingTeam(game.currentInning);

            var currentLineup = game.lineups[game.atBat];
            var currentBatterIndex = game.lineups[game.atBat + 'ActiveBatterIndex'];
            var currentBatter = currentLineup[currentBatterIndex];

            game.currentBatter = currentBatter;

            game.baseRunners = getClearedBases();

            game.currentPitcher = game.atBat === 'away' ? game.pitchers.away : game.pitchers.home;

            if (game.currentInning > 9) game.currentInning = 1;
        },

        nextBatter: function () {

            var game = this.game;

            var currentBatter = this.getCurrentBatter(game);
            currentBatter.isBatting = false;

            if (this.getCurrentBatterIndex() === 9) game.lineups[game.atBat + 'ActiveBatterIndex'] = 1;
            else game.lineups[game.atBat + 'ActiveBatterIndex'] += 1;

            var currentLineup = this.getCurrentLineup();
            var dueUpBatter = currentLineup[game.lineups[game.atBat + 'ActiveBatterIndex']];
            game.currentBatter = dueUpBatter;
            dueUpBatter.isBatting = true;

            return this;
        },

        getUpdatedGame: function () {
            return this.game;
        }
    };

    return simulator;
}

module.exports = Simulation;
