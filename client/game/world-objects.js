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

    createTile(x, y) {
        const colSize = 50,
            tileSize = 100;
        const tile = Bodies.rectangle(x, y, colSize, colSize, { isStatic: true });
        tile.isSensor = true;
        tile.label = 'tile';
        tile.render.lineWidth = 2;
        tile.render.strokeStyle = 'red';

        tile.nodes = {
            top: null,
            bot: null,
            left: null,
            right: null,
        };

        tile.updateSprite = () => {};

        tile.draw = (ctx) => {
            let r = tile.nodes.right,
                l = tile.nodes.left,
                u = tile.nodes.top,
                d = tile.nodes.bot;

            ctx.fillStyle = 'green';
            if (r) {
                if (l && !u && !d) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                } else if (!l && u && !d) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                } else if (!l && !u && d) {
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                } else if (l && u && !d) {
                    ctx.fillStyle = 'gray';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 50);
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                } else if (!l && u && d) {
                    ctx.fillStyle = 'cyan';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                } else if (l && !u && d) {
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                } else if (l && u && d) {
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                } else {
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                }
            } else if (l) {
                if (!u && d) {
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
                } else if (u && !d) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 75);
                } else if (u && d) {
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                } else {
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                }
            } else if (u) {
                if (d) {
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                }
                ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 75);
            } else if (d) {
                ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
            }
        };
        return tile;
    }

    createMap(name, { x, y }) {
        const initPos = Vector.create(x, y);
        const tileMap = [];
        const inc = this._tileSize;
        let currentTile = tileMap[tileMap.push(this.createTile(initPos.x, initPos.y)) - 1];

        const addTile = (dir, stay) => {
            if (currentTile.nodes[dir]) {
                console.log(`A tile on the ${dir} of tile ${currentTile.id} already exists`);
                return;
            }

            let newX = currentTile.position.x,
                newY = currentTile.position.y;
            let newTileDir = '';
            switch (dir) {
                case 'right':
                    newX += inc;
                    newTileDir = 'left';
                    break;
                case 'left':
                    newX -= inc;
                    newTileDir = 'right';
                    break;
                case 'top':
                    newY -= inc;
                    newTileDir = 'bot';
                    break;
                case 'bot':
                    newY += inc;
                    newTileDir = 'top';
                    break;
                default:
                    break;
            }

            const newTile = this.createTile(newX, newY);
            newTile.nodes[newTileDir] = currentTile;
            currentTile.nodes[dir] = newTile;
            tileMap.push(newTile);
            if (!stay) {
                currentTile = newTile;
            }
        };

        //1 right | 2 left | 3 up | 4 down
        const addTo = (move, dir) => {
            const { x, y } = currentTile.position;
            let newX = x,
                newY = y;
            let nextNode = '',
                parent = '';
            switch (dir) {
                case 1:
                    newX += inc;
                    nextNode = 'right';
                    parent = 'left';
                    break;
                case 2:
                    newX -= inc;
                    nextNode = 'left';
                    parent = 'right';
                    break;
                case 3:
                    newY -= inc;
                    nextNode = 'up';
                    parent = 'down';
                    break;
                case 4:
                    newY += inc;
                    nextNode = 'down';
                    parent = 'up';
                    break;

                default:
                    break;
            }
            const newTile = this.createTile(newX, newY);
            tileMap.push(newTile);
            currentTile.nodes[nextNode] = newTile;
            newTile.nodes.parent = parent;
            if (move) {
                currentTile = newTile;
            }
        };

        if (name === 'debug') {
            addTile('right');
            addTile('top', true);
            addTile('top', true);
            addTile('right');
            addTile('right');
            // addTo(true, 1);
            // addTo(true, 1);
            // addTo(true, 1);
            // addTo(false, 3);
            // addTo(true, 4);
            // addTo(true, 4);
        }

        return tileMap;
    }
}
