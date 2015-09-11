'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var Simulation = require('./Simulation');

var mockGame = require('./src/js/utils/mocks').mockGame;

function Engine (opts) {
    this.outStreams = {};
    this.Database = opts.Database;
    this.wsServer = opts.wsServer;
}

inherits(Engine, EventEmitter);

Engine.prototype.logIn = function (payload) {
    var self = this;

    this.Database.getTeam(payload.teamId, (err, team) => {
        if (err) console.log(err);
        // console.error(err, team);
        team[0].websocketId = payload.websocketId;
        // console.error(team[0]);

        self.Database.updateTeam(payload.teamId, team[0], () => {});

        self.Database.getGame(1, (err, res) => {
            if (err) console.log(err);
            self.wsServer.emit('currentGame', res[0]);
        });
    });
};

Engine.prototype.getTeam = function (payload) {
    var self = this;
    self.Database.getTeam(payload.teamId, function (err, team) {
        if (err) console.log(err);

        var outStream = self.outStreams[payload.websocketId];
        self.wsServer.emitTo(outStream, 'gotTeam', team);
    });
};

Engine.prototype.getCurrentGame = function (payload) {
    var self = this;

    this.Database.getTeam(payload.teamId, (err) => {
        if (err) return console.log(err);
        // TODO: current game is hardcoded
        self.Database.getGame(1, (err, res) => {
            if (err) console.log(err);
            self.wsServer.emit('currentGame', res[0]);
        });
    });
};

Engine.prototype.updateGame = function (callback) {
    var Database = this.Database;
    var game = this.game;

    Database.updateGame(1, game, (err) => {
        if (err) callback(err);
        Database.getGame(1, (err, updatedGame) => {
            game = updatedGame;
            callback(err, updatedGame);
        });
    });
};


Engine.prototype.sendUpdateToClients = function (game) {
    this.wsServer.emit('currentGame', game);
};

Engine.prototype.addTeam = function addTeam (teamSpec, callback) {
    if (!callback) callback = function () {};

    teamSpec = {
        name: 'Dukes',
        teamId: 'dukes',
        city: 'Pointe-Claire',
        websocketId: ''
    };

    this.Database.addTeam(teamSpec, (err, res) => {
        if (err) return console.log(err);
        console.log(res);
    });
};


Engine.prototype.readyMove = function (gameId, team) {

    this.Database.getGame(gameId, (err, games) => {
        var game = games[0];

        game.currentPlay[team].ready = true;

        var curPlay = game.currentPlay;

        if (curPlay.home.ready && curPlay.away.ready) {

            var playSimulation = new Simulation(game);

            playSimulation.unReadyTeams();
            playSimulation.simulatePlay();
            playSimulation.nextBatter();
            playSimulation.changeInning();

            game = playSimulation.getUpdatedGame();
        }

        this.Database.updateGame(gameId, game, (err) => {
            if (err) return console.log(err);
            console.log('sending game');
            this.Database.getGame(gameId, (err, games) => {
                this.wsServer.emit('currentGame', games[0]);
            });
        });

    });

};

Engine.prototype.createGame = function () {

    var gameSpec = mockGame();
    gameSpec.atBat = 'away';
    gameSpec.currentBatter = gameSpec.lineups.away[1];
    gameSpec.currentPitcher = gameSpec.pitchers.home;
    // console.error(gameSpec);


    // this.Database.createTable('games');
    // this.Database.createTable('players');
    //
    // this.Database.updateGame(1, gameSpec, (err, res) => {
    //     console.log(err, res);
    // });

    // this.Database.newGame(gameSpec, function (err, result) {
    //     console.log(result);
    // });
};

module.exports = Engine;
