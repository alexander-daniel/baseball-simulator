// 'use strict';

var http = require('http');
var ecstatic = require('ecstatic');
var Server = require('agora').Server;
// var hat = require('hat');

var staticOptions = { root: __dirname + '/static' };
var staticServer = http.createServer(ecstatic(staticOptions));
var wsServer = new Server({ port: 8000 });
var Database = require('./rethink');
var Engine = require('./engine');
var _clientId;

var engine = new Engine({
    Database: Database,
    wsServer: wsServer
});

wsServer.on('connection', function registerListeners (conn) {
    _clientId = conn.id;

    /* returned inStream is an emitter */
    var inStream = conn.inStream;

    /* you can emit to the outStream and data will be piped off to the client */
    var outStream = conn.outStream;

    engine.outStreams[conn.id] = outStream;

    inStream.on('logIn', engine.logIn.bind(engine));

    inStream.on('readyMove', function (payload) {
        engine.readyMove(payload.gameId, payload.team);
    });

    inStream.on('getTeam', engine.getTeam.bind(engine));

    inStream.on('getCurrentGame', engine.getCurrentGame.bind(engine));

    /* emit to one client */
    wsServer.emitTo(outStream, 'ready', _clientId);
});



Database.on('ready', function () {

    engine.createGame();
    // Database.createTable('teams');
    //
    // var teamSpec = {
    //     name: 'Dukes',
    //     teamId: 'dukes',
    //     city: 'Pointe-Claire',
    //     websocketId: ''
    // };
    //
    // Database.addTeam(teamSpec, function (err, res) {
    //     if (err) return console.log(err);
    //     console.log(res);
    // });

    staticServer.listen(8888);
});

module.exports = wsServer;
