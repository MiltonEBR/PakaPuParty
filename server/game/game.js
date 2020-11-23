const Matter = require('matter-js');
const GameBoard = require('./gameBoard');

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
            notInteractable: 0x0001,
            interactable: 0x0002,
            world: 0x0004,
        };
    }

    get filterList() {
        return this._filterList;
    }

    init() {
        this.createBoard();
    }

    createBoard() {
        const board = new GameBoard(this);
        board.createBoard('debug', { x: 100, y: 200 });
        this._gameBoard = board;
    }

    createInstance(x, y, sX, sY, options) {
        const newInstance = Bodies.rectangle(x, y, sX, sY, options);
        World.add(this.world, newInstance);
        return newInstance;
    }

    // createBox({ x, y }) {
    //     //Test purposes
    //     const test = Bodies.rectangle(x, y, 50, 50);
    //     World.add(this.world, test);
    //     this._playerList.push(test);
    // }

    serialize() {
        const serializeVertices = (vertexArray) => {
            const serializedList = vertexArray.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            });

            return serializedList;
        };

        const player = this._playerList.map((player) => {
            return {
                id: player.id,
                position: player.position,
                vertices: serializeVertices(player.vertices),
            };
        });
        return { player, tiles: this._gameBoard.serialize() };
    }
}

module.exports = Game;
