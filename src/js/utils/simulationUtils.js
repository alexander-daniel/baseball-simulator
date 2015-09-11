'use strict';

function rollDie(numSides) {
    return Math.floor(Math.random() * numSides) + 1;
}

function getClearedBases () {
    var baseRunners = {
        first: {},
        second: {},
        third: {}
    };

    return baseRunners;
}

function getBattingTeam (currentInning) {
    if (currentInning % 1 === 0.5) return 'home';
    else return 'away';
}

exports.rollDie = rollDie;
exports.getClearedBases = getClearedBases;
exports.getBattingTeam = getBattingTeam;
