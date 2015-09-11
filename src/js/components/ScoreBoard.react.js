'use strict';

import React from 'react';

var ScoreBoard = React.createClass({
    render: function () {
        let currentGame = this.props.currentGame;
        let scoreBoard = currentGame.scoreBoard;
        let currentInning = currentGame.currentInning;

        if (!scoreBoard) return null;

        let homeScores = scoreBoard.home.map((score, inning) => {
            inning += 1;
            let style = {};
            if (inning + 0.5 === currentInning) style = {backgroundColor: 'rgba(239,239,239,0.8)'};
            return (
                <td key={inning} style={style}>{score}</td>
            );
        });

        let awayScores = scoreBoard.away.map((score, inning) => {
            inning += 1;
            let style = {};
            if (inning === currentInning) style = {backgroundColor: 'rgba(239,239,239,0.8)'};
            return (
                <td style={style} key={inning}>{score}</td>
            );
        });

        return (
            <table>

                <tr>
                    <thead>
                    <th>Inning</th>
                    {[1,2,3,4,5,6,7,8,9].map((inning) => {
                        return <th>{inning}</th>;
                    })}
                    </thead>
                </tr>

                <tbody>
                    <tr>
                        <td>{this.props.currentGame.awayTeam}</td>
                        {awayScores}
                    </tr>

                    <tr>
                        <td>{this.props.currentGame.homeTeam}</td>
                        {homeScores}
                    </tr>
                </tbody>


            </table>
        );
    }
});

module.exports = ScoreBoard;
