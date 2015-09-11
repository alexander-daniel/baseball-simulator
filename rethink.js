'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var r = require('rethinkdb');
var connection = null;

function Database () {

    this.createTable = function (tableName, callback) {
        if (!callback) callback = function () {};

        r.db('test').tableCreate(tableName).run(connection, function(err, result) {
            if (err) throw err;
            callback(result);
        });
    };

    this.getPlayer = function (name, callback) {
        if (!callback) callback = function () {};

        var playerTable = r.table('players');
        var filter = playerTable.filter(r.row('name').eq(name));

        filter.run(connection, function(err, cursor) {
            if (err) throw err;

            cursor.toArray(function(err, result) {
                if (err) return callback(err);
                if (!result.length) return callback('no results');

                callback(null, result);
            });
        });
    };

    this.addPlayer = function (playerSpec, callback) {
        if (!callback) callback = function () {};

        r.table('players').insert(playerSpec).run(connection, function (err, result) {
            if (err) callback(err);
            callback(null, result);
        });
    };

    this.updatePlayer = function (name, update, callback) {
        if (!callback) callback = function () {};

        var playerTable = r.table('players');
        var filter = playerTable.filter(r.row('name').eq(name));

        filter.update(update).run(connection, function(err, result) {
            if (err) callback(err);
            callback(null, result);
        });
    };

    this.newGame = function (opts, callback) {
        if (!callback) callback = function () {};

        r.table('games').insert(opts).run(connection, function (err, result) {
            if (err) callback(err);
            callback(null, result);
        });
    };

    this.getGame =  function (gameId, callback) {
        if (!callback) callback = function () {};

        var gameTable = r.table('games');
        var filter = gameTable.filter(r.row('gameId').eq(gameId));

        filter.run(connection, function(err, cursor) {
            if (err) callback(err);

            cursor.toArray(function(err, result) {
                if (err) return callback(err);
                if (!result.length) return callback('no results');

                callback(null, result);
            });
        });
    };

    this.updateGame = function (gameId, update, callback) {
        if (!callback) callback = function () {};

        var gameTable = r.table('games');
        var filter = gameTable.filter(r.row('gameId').eq(gameId));

        filter.replace(update).run(connection, function(err, result) {
            if (err) callback(err);
            console.error(result);
            callback(null, result);
        });
    };

    this.getAllGames = function (callback) {
        if (!callback) callback = function () {};

        r.table('games').run(connection, function(err, cursor) {
            if (err) throw err;

            cursor.toArray(function(err, result) {
                if (err) callback(err);
                callback(null, result);
            });
        });
    };

    this.getTeam = function (teamId, callback) {
        if (!callback) callback = function () {};

        var gameTable = r.table('teams');
        var filter = gameTable.filter(r.row('teamId').eq(teamId));

        filter.run(connection, function(err, cursor) {
            if (err) callback(err);

            cursor.toArray(function(err, result) {
                if (err) return callback(err);
                if (!result.length) return callback('no results');

                callback(null, result);
            });
        });
    };

    this.addTeam = function (teamSpec, callback) {
        if (!callback) callback = function () {};

        r.table('teams').insert(teamSpec).run(connection, function (err, result) {
            if (err) callback(err);
            callback(null, result);
        });
    };

    this.updateTeam = function (teamId, update, callback) {
        if (!callback) callback = function () {};

        var gameTable = r.table('teams');
        var filter = gameTable.filter(r.row('teamId').eq(teamId));

        filter.update(update).run(connection, function(err, result) {
            if (err) callback(err);
            callback(null, result);
        });
    };


}

util.inherits(Database, EventEmitter);

var database = new Database();

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    database.emit('ready');
});

module.exports = database;
