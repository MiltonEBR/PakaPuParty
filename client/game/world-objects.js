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

        tile.draw = (ctx) => {
            ctx.fillStyle = 'green';
            ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 50);
        }; //Default draw,meant for updateSprite to determine

        tile.updateSprite = () => {
            //Determines which sprite the tile should use based on siblings (Not final sprites or calculations)
            let r = tile.nodes.right,
                l = tile.nodes.left,
                u = tile.nodes.top,
                d = tile.nodes.bot;

            const fill = 'green';
            if (r) {
                if (l && !u && !d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    };
                } else if (!l && u && !d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                    };
                } else if (!l && !u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                    };
                } else if (l && u && !d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 50);
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    };
                } else if (!l && u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    };
                } else if (l && !u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    };
                } else if (l && u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 25);
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y + 25, 50, 25);
                    };
                } else {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 75, 50);
                    };
                }
            } else if (l) {
                if (!u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
                    };
                } else if (u && !d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 75);
                    };
                } else if (u && d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                    };
                } else {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 75, 50);
                    };
                }
            } else if (u) {
                if (d) {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                    };
                } else {
                    tile.draw = (ctx) => {
                        ctx.fillStyle = fill;
                        ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 75);
                    };
                }
            } else if (d) {
                tile.draw = (ctx) => {
                    ctx.fillStyle = fill;
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 75);
                };
            } else {
                tile.draw = (ctx) => {
                    ctx.fillStyle = fill;
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 50);
                };
            }
        };

        return tile;
    }

    createBoard(name, { x, y }) {
        //Returns an array of the map tiles for the engine to run depending on map name
        const initPos = Vector.create(x, y);
        const tileMap = [];
        const inc = this._tileSize;
        let currentTile = tileMap[tileMap.push(this.createTile(initPos.x, initPos.y)) - 1];
        let markedTile = null;

        const updateTileSprites = () => {
            tileMap.forEach((tile) => {
                tile.updateSprite();
            });
        };

        const addTile = (dir, stay) => {
            //Adds a tile to the map
            if (currentTile.nodes[dir]) {
                console.log(`A tile on the ${dir} of tile ${currentTile.id} already exists`);
                return;
            }
            //Missing checking for already existing nodes that are non-childs, in order to link instead of create (Should be fixed with DFS)

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

        const moveToTile = (tile) => {
            //NEEDS TO BECOME DFS
            currentTile = tile;
        };

        const saveTile = (tile) => {
            markedTile = tile;
        };

        if (name === 'debug') {
            addTile('right');
            addTile('top', true);
            addTile('top', true);
            addTile('right');
            addTile('right');
            updateTileSprites();
        }

        return tileMap;
    }
}
