const Matter = require('matter-js');
const GameBoard = require('./gameBoard');
const Player = require('./player');

const Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

class Game {
    constructor() {
        this.engine = Engine.create();
        let engine = this.engine;
        this.world = this.engine.world;
        this.world.gravity = { scale: 0, x: 0, y: 0 };
        this._gameBoard = null;
        this._playerList = [];
        this._readyList = [];
        this._inProgress = false;
        this._colors = [
            { color: 'blue', used: false },
            { color: 'green', used: false },
            { color: 'yellow', used: false },
            { color: 'purple', used: false },
            { color: 'gray', used: false },
            { color: 'pink', used: false },
            { color: 'red', used: false },
            { color: 'brown', used: false },
        ];
        this._currentTurn = 0;

        setInterval(function () {
            Engine.update(engine, 20);
        }, 20);

        this._filterList = {
            world: 0x0001,
        };

        Events.on(this.engine, 'collisionStart', (e) => {
            for (let pair of e.pairs) {
                const bodyA = pair.bodyA,
                    bodyB = pair.bodyB;
                let playerInstance =
                    bodyA.label === 'player' ? bodyA : bodyB.label === 'player' ? bodyB : null;
                let tile = bodyA.label === 'tile' ? bodyA : bodyB.label === 'tile' ? bodyB : null;

                if (playerInstance && tile) {
                    const fullPlayer = this._playerList.find(
                        (player) => player.instance.id === playerInstance.id
                    );

                    fullPlayer.tileCollision();
                }
            }
        });

        this.createBoard();
    }

    removePlayer(num) {
        const usedColor = this._playerList[num].color;
        this._colors[
            this._colors.findIndex((colorObj) => colorObj.color === usedColor)
        ].used = false;

        const removedPlayer = this._playerList.splice(num, 1);
        World.remove(this.world, removedPlayer[0].instance);
        this._readyList.splice(num, 1);

        return removedPlayer[0];
    }

    availableUsername(name) {
        for (let player of this._playerList) {
            if (player.username === name) return false;
        }

        return true;
    }

    getNextColor(current) {
        let newColor = current ? current : null;
        let currentIndex = current
            ? this._colors.findIndex((el) => {
                  return el.color === current;
              })
            : 0;

        for (let i = currentIndex; i < this._colors.length; i++) {
            if (!this._colors[i].used) {
                newColor = this._colors[i].color;
                this._colors[i].used = true;
                if (i !== currentIndex && current) {
                    this._colors[currentIndex].used = false;
                }
                break;
            }
        }

        return newColor;
    }

    getLastColor(current) {
        let newColor = current ? current : null;
        let currentIndex = current
            ? this._colors.findIndex((el) => {
                  return el.color === current;
              })
            : this._colors.length - 1;

        for (let i = currentIndex; i >= 0; i--) {
            if (!this._colors[i].used) {
                newColor = this._colors[i].color;
                this._colors[i].used = true;
                if (i !== currentIndex && current) {
                    this._colors[currentIndex].used = false;
                }
                break;
            }
        }

        return newColor;
    }

    get inProgress() {
        return this._inProgress;
    }

    get currentTurn() {
        return this._currentTurn;
    }

    get playerList() {
        return this._playerList;
    }

    get filterList() {
        return this._filterList;
    }

    get readyList() {
        return this._readyList;
    }

    startGame() {
        this._inProgress = true;
        this._currentTurn = 0;
        this.playerList[this._currentTurn].turn();
        return this._playerList[this._currentTurn];
    }

    createBoard() {
        this._gameBoard = new GameBoard(this);
        this._gameBoard.createBoard('debug', { x: 100, y: 200 });
    }

    createPlayer(name, sock) {
        const newPlayer = new Player(name, this._gameBoard.tiles[0], this, sock);
        newPlayer.color = this.getNextColor();
        this._readyList.push(false);
        // const a = e.pairs[0].bodyA;
        // const b = e.pairs[0].bodyB;
        // let playerColl;
        // let tileColl;
        // if (a.label === 'player') {
        //     playerColl = a;
        // } else if (b.label === 'player') {
        //     playerColl = b;
        // }
        // if (b.label === 'tile') {
        //     tileColl = b;
        // } else if (a.label === 'tile') {
        //     tileColl = a;
        // }
        // if (playerColl && tileColl) {
        //     if (playerColl.game.targetTile === tileColl) {
        //         playerColl.game.stop();
        //         dirArrows.setToTile(playerColl.game.currentTile);
        //     }
        // }

        return this._playerList.push(newPlayer);
    }

    createInstance(x, y, sX, sY, options) {
        const newInstance = Bodies.rectangle(x, y, sX, sY, options);
        World.add(this.world, newInstance);
        return newInstance;
    }

    serialize() {
        //Serialize called on every update
        const serializeVertices = (vertexArray) => {
            const serializedList = vertexArray.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            });

            return serializedList;
        };

        const players = this._playerList.map((player) => {
            return {
                id: player.instance.id,
                position: player.instance.position,
                vertices: serializeVertices(player.instance.vertices),
            };
        });
        return [...players];
    }

    serializeAll() {
        //Serialize called on joining/init
        const serializeVertices = (vertexArray) => {
            const serializedList = vertexArray.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            });

            return serializedList;
        };

        const players = this._playerList.map((player) => {
            return player.serializeAll();
        });
        return { players, tiles: this._gameBoard.serialize() };
    }

    throwDice(playerNum) {
        const diceRes = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            this._playerList[playerNum].move(diceRes);
        }, 1500);

        return diceRes;
    }
}

module.exports = Game;
