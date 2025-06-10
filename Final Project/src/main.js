"use strict"

let config = 
{
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1080,
    height: 700,
    scene: [Load, Title, LevelOne, LevelTwo, GameOver, GameOverWin]
}

var cursors;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);