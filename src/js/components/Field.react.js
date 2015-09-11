'use strict';

import React from 'react';
import assign from 'object-assign';

var Field = React.createClass({
    render: function () {
        // if (!this.props.game || !this.props.game.baseRunners || !this.props.game.currentBatter) return null;
        let game = this.props.game;

        let style = {
            backgroundImage: 'url(img/field.png)',
            backgroundSize: '100% 100%',
            height: '400px',
            width: '400px',
            position: 'relative',
            borderRadius: '8px'
        };

        let baseRunnerStyle = {
            backgroundColor: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            padding: '4px',
            position: 'absolute'
        };

        let baseRunners = ['first', 'second', 'third'].map((baseRunner) => {
            if (!game.baseRunners[baseRunner]) return null;
            let style;

            switch (baseRunner) {
                case 'first':
                    style = assign({}, baseRunnerStyle, { top: 200, right: 10 });
                    return <div style={style}>{game.baseRunners.first.name}</div>;
                case 'second':
                    style = assign({}, baseRunnerStyle, { top: 100, right: 150 });
                    return  <div style={style}>{game.baseRunners.second.name}</div>;
                case 'third':
                    style = assign({}, baseRunnerStyle, { top: 200, left: 10 });
                    return <div style={style}>{game.baseRunners.third.name}</div>;
            }
        });

        let batterStyle = assign({}, baseRunnerStyle, { top: 350, right: 150 });
        let currentBatter = game.currentBatter ? <div style={batterStyle}>{game.currentBatter.name}</div> : null;

        return (
            <div style={style}>
                {currentBatter}
                {baseRunners}
            </div>
        );
    }
});

module.exports = Field;
