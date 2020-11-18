class WorldObjects {
    constructor() {
        this._filterList = {
            notInteractable: 0x0001,
            interactable: 0x0002,
        };
    }

    get filterList() {
        return this._filterList;
    }

    createPlayer(spawnTile) {
        const { x, y } = spawnTile.position;
        const player = Bodies.rectangle(x, y, 50, 50, {
            frictionAir: 0.0,
            // restitution: 0.0,
            // density: 1,
            collisionFilter: {
                category: this._filterList.notInteractable,
            },
        });
        player.game = {
            currentTile: spawnTile,
            speed: 2,
            setSpeed(num) {
                this.speed = num;
            },
            moveTo(tile) {
                player.frictionAir = 0.0;
                const { x, y } = tile.position;
                const tileVector = Vector.create(x, y);
                const playerVector = Vector.create(player.position.x, player.position.y);
                const dirVector = Vector.normalise(Vector.sub(tileVector, playerVector));
                Body.setVelocity(player, Vector.mult(dirVector, this.speed));
            },
            stop() {
                player.frictionAir = 0.05;
            },
        };
        player.label = 'player';
        player.render.lineWidth = 4;
        player.render.strokeStyle = 'blue';
        return player;
    }

    createTile(x, y, dir) {
        const tile = Bodies.rectangle(x, y, 50, 50, { isStatic: true });
        tile.isSensor = true;
        tile.label = 'tile';
        tile.render.lineWidth = 2;
        tile.render.strokeStyle = 'red';

        tile.nodes = {
            up: null,
            down: null,
            left: null,
            right: null,
        };

        tile.draw = (ctx) => {
            switch (dir) {
                case 'null':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 50);
                    break;
                case 'up':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                    break;
                case 'sides':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    break;
                case 'right':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    break;
                case 'left-down':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                    break;
                case 'left-up':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                    break;
                case 'left':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    break;
                case 'right-down':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                    break;
                case 'right-up':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                    break;

                default:
                    break;
            }
        };
        return tile;
    }

    createMap(name) {
        const tilePos = Vector.create(100, 100);
        const tileMap = [];

        if (name === 'debug') {
            tileMap.push(this.createTile(tilePos.x, tilePos.y, 'right'));
            tilePos.x += 100;

            for (let i = 0; i < 3; i++) {
                tileMap.push(this.createTile(tilePos.x, tilePos.y, 'sides'));
                tileMap[tileMap.length - 2].nodes.right = tileMap[tileMap.length - 1];
                tilePos.x += 100;
            }
        }

        return tileMap;
    }
}
