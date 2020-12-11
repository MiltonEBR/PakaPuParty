const { Vector } = require('matter-js');
const Matter = require('matter-js');

class Player {
    constructor(name, spawnTile, game, sock) {
        this._currentTile = spawnTile;
        this._game = game;
        this._name = name;
        this._instance;
        //this._items;
        this._socket = sock;
        this._points = 0;
        this._color = '';
        this.movesLeft = 0;
        this.speed = 1;

        this.spawn(spawnTile.position);
    }

    turn() {
        this._socket.emit('yourTurn');
    }

    moveTiles(num) {
        if (num) {
            this.movesLeft = num;
        }
        const availableTiles = this._currentTile.getWalkableTiles();
        let availableKeys = Object.keys(availableTiles);
        if (availableKeys.length === 1) {
            this.moveTo(availableTiles[availableKeys[0]].position);
        } else {
            this._instance.frictionAir = 0.05;
            sock.emit('selectDirection', { options: availableKeys });
        }
    }

    moveTo({ x, y }) {
        this._instance.frictionAir = 0.0;
        const targetVector = Matter.Vector.create(x, y),
            playerVector = Matter.Vector.create(
                this._instance.position.x,
                this._instance.position.y
            );

        const dirVector = Matter.Vector.normalise(Vector.sub(targetVector, playerVector));

        Matter.Body.setVelocity(this._instance, Vector.mult(dirVector, this.speed));
    }

    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
    }

    get username() {
        return this._name;
    }

    get instance() {
        return this._instance;
    }

    get score() {
        return this._points;
    }

    set addPoints(points) {
        this._points += points;
    }

    tileCollision(tile) {
        this._currentTile = tile;
        this.movesLeft = Math.max(Math.min(this.movesLeft - 1, Math.max(0, 6)), Math.min(0, 6));
        if (this.movesLeft < 1) {
            this._instance.frictionAir = 0.05;
        } else {
            this.moveTiles();
        }

        return this.movesLeft;
    }

    spawn(position) {
        const { x, y } = position;
        const playerSize = 50;
        this._instance = this._game.createInstance(x, y, playerSize, playerSize, {
            frictionAir: 0.0,
            // restitution: 0.0,
            // density: 1,
            collisionFilter: {
                category: this._game.filterList.world,
                mask: this._game.filterList.world,
            },
        });
        this._instance.label = 'player';
    }

    serialize() {
        const player = this._instance;
        return {
            id: player.id,
            position: player.position,
            vertices: player.vertices.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            }),
            points: this._points,
        };
    }

    serializeAll() {
        const player = this._instance;
        return {
            id: player.id,
            position: player.position,
            vertices: player.vertices.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            }),
            points: this._points,
            username: this._name,
            color: this._color,
        };
    }
}

module.exports = Player;
