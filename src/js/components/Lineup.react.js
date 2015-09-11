'use strict';

import React from 'react';

let statCategories = [
    'name',
    'AB',
    'R',
    'H',
    'RBI',
    'BB',
    'K',
    'HBP',
    'E',
    'SF',
    'SB',
    'SB',
    'CS',
    'A'
];

var Player = React.createClass({
    render: function () {
        var isAtBat = this.props.isBatting;
        var style = {
            cursor: 'pointer'
        };

        if (isAtBat) style.backgroundColor = 'rgba(239,239,239,0.8)';
        let playerStats = statCategories.map((category, i) => {
            if (category === 'name') return <td className="+soft" key={i+category}>{this.props.name}</td>;
            return (
                    <td className="+soft" key={i+category}>{this.props.gameStats[category] || 0}</td>
            );
        });

        return (
            <tr style={style}>
                {playerStats}
            </tr>
        );
    }
});

var Lineup = React.createClass({
    render: function () {
        if (!this.props.currentGame || !this.props.lineup) return null;

        let statHeaders = statCategories.map((category, i) => {
            return (
                <td className="+soft" key={i}>{category}</td>
            );
        });

        var sortable = [];
        for (var player in this.props.lineup) {
            sortable.push([this.props.lineup[player], this.props.lineup[player].battingOrder]);
            sortable.sort(function(a, b) {return a[1] - b[1];});
        }
        console.log(sortable);

        let lineup = sortable.map((player, i) => {
            console.log(player[0]);
            return <Player {...player[0]} key={i}/>;
        });

        return (

            <table>
                <tr>
                    {this.props.currentGame.atBat}
                </tr>

                <tbody>
                    <tr>
                        {statHeaders}
                    </tr>

                    {lineup}
                </tbody>
            </table>
        );
    }
});

module.exports = Lineup;
