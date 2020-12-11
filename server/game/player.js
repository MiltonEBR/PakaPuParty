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

        this.spawn(spawnTile.position);
    }

    turn() {
        this._socket.emit('yourTurn');
    }

    move(num) {
        this.movesLeft = num;
        Matter.Body.setVelocity(this._instance, { x: 1, y: 0 });
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

    tileCollision() {
        this.movesLeft = Math.max(Math.min(this.movesLeft - 1, Math.max(0, 6)), Math.min(0, 6));
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
