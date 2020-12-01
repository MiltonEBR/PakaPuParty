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

        setInterval(function () {
            Engine.update(engine, 20);
        }, 20);

        this._filterList = {
            world: 0x0001,
        };

        this.createBoard();
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
        return this._playerList.push(new Player(name, this._gameBoard.tiles[0], this));
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
            return {
                id: player.instance.id,
                position: player.instance.position,
                vertices: serializeVertices(player.instance.vertices),
                username: player.username,
            };
        });
        return { players, tiles: this._gameBoard.serialize() };
    }
}

module.exports = Game;
