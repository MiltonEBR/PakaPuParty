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
        this._inProgress = false;
        this._colors = [
            { color: 'blue', used: false },
            { color: 'green', used: false },
            { color: 'yellow', used: false },
            { color: 'purple', used: false },
            { color: 'white', used: false },
            { color: 'pink', used: false },
            { color: 'red', used: false },
            { color: 'brown', used: false },
        ];

        setInterval(function () {
            Engine.update(engine, 20);
        }, 20);

        this._filterList = {
            world: 0x0001,
        };

        this.createBoard();
    }

    availableUsername(name) {
        for (let player of this._playerList) {
            if (player.username === name) return false;
        }

        return true;
    }

    getAvailableColor(current) {
        let newColor = null;
        for (let colorObj of this._colors) {
            if (current && colorObj.color === current) {
                colorObj.used = false;
            }

            if (!colorObj.used && newColor === null) {
                colorObj.used = true;
                newColor = colorObj.color;
            }
        }

        return newColor;
    }

    get inProgress() {
        return this._inProgress;
    }

    get playerList() {
        return this._playerList;
    }

    get filterList() {
        return this._filterList;
    }

    createBoard() {
        this._gameBoard = new GameBoard(this);
        this._gameBoard.createBoard('debug', { x: 100, y: 200 });
    }

    createPlayer(name) {
        const newPlayer = new Player(name, this._gameBoard.tiles[0], this);
        newPlayer.color = this.getAvailableColor();
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
}

module.exports = Game;
