'use strict';

import React from 'react';

var PlateMatchup = React.createClass({
    render: function () {
        if (!this.props.currentGame.currentPitcher) return null;
        var currentBatter = this.props.currentGame.currentBatter;
        var avg = (currentBatter.gameStats.H / currentBatter.gameStats.AB).toFixed(3).slice(1,5);
        return (
            <div>
                <div>{'Pitching: ' + this.props.currentGame.currentPitcher.name}</div>
                <div>{'Batting: ' + this.props.currentGame.currentBatter.name}{'    '}<b>{avg}</b></div>
                <div></div>
            </div>
        );
    }
});

module.exports = PlateMatchup;
