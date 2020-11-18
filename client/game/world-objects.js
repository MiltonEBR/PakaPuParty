class WorldObjects {
    constructor() {
        this._filterList = {
            notInteractable: 0x0001,
            interactable: 0x0002,
        };
        this._tileSize = 100;
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
        const colSize = 50,
            tileSize = 100;
        const tile = Bodies.rectangle(x, y, colSize, colSize, { isStatic: true });
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
        const initPos = Vector.create(100, 100);
        const tileMap = [];
        const inc = this._tileSize;
        let currentTile = tileMap[tileMap.push(this.createTile(initPos.x, initPos.y, 'null')) - 1];

        const addTo = (move, dir) => {
            const { x, y } = currentTile.position;
            let newX = x,
                newY = y;
            let nextNode = '';
            switch (dir) {
                case 1:
                    newX += inc;
                    nextNode = 'right';
                    break;
                case 2:
                    newX -= inc;
                    nextNode = 'left';
                    break;
                case 3:
                    newY -= inc;
                    nextNode = 'up';
                    break;
                case 4:
                    newY += inc;
                    nextNode = 'down';
                    break;

                default:
                    break;
            }
            const newTile = this.createTile(newX, newY, 'null');
            tileMap.push(newTile);
            currentTile.nodes[nextNode] = newTile;
            if (move) {
                currentTile = newTile;
            }
        };

        if (name === 'debug') {
            addTo(true, 1);
            addTo(true, 1);
            addTo(false, 3);
            addTo(true, 1);
            addTo(true, 4);

            addTo(false, 1);
            addTo(false, 2);
            addTo(true, 4);
        }

        return tileMap;
    }
}
