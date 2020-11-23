const Matter = require('matter-js');

class Player {
    constructor(spawnTile, game) {
        this._currentTile = spawnTile;
        this._game = game;
        this._instance;
        //this._items;
        //this._socket;
        this._points = 0;

        this.spawn(spawnTile.position);
    }

    move() {
        Matter.Body.setVelocity(this._instance, { x: 1, y: 0 });
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

    spawn(position) {
        const { x, y } = position;
        const playerSize = 50;
        this._instance = this._game.createInstance(x, y, playerSize, playerSize, {
            frictionAir: 0.0,
            // restitution: 0.0,
            // density: 1,
            collisionFilter: {
                category: this._game.filterList.notInteractable,
                mask: this._game.filterList.world,
            },
        });
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
}

module.exports = Player;
