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

    createDirectionArrows(x, y) {
        const dirArrows = {
            arrows: {
                top: Bodies.rectangle(x, y + 50, 25, 50, { isStatic: true }),
                bot: Bodies.rectangle(x, y - 50, 25, 50, { isStatic: true }),
                left: Bodies.rectangle(x - 50, y, 50, 25, { isStatic: true }),
                right: Bodies.rectangle(x + 50, y, 50, 25, { isStatic: true }),
            },
        };
        dirArrows.list = Object.values(dirArrows.arrows);
        dirArrows.changePos = ({ x, y }) => {
            Body.setPosition(dirArrows.arrows.top, { x, y: y + 50 });
            Body.setPosition(dirArrows.arrows.bot, { x, y: y - 50 });
            Body.setPosition(dirArrows.arrows.left, { x: x - 50, y });
            Body.setPosition(dirArrows.arrows.right, { x: x + 50, y });
        };
        for (let arr of dirArrows.list) {
            arr.render.lineWidth = 4;
            arr.render.strokeStyle = 'red';
        }

        return dirArrows;
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

        tile.getNodes = () => {
            const { nodes } = tile;
            return [nodes.top, nodes.bot, nodes.left, nodes.right];
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

            let existingTile = searchTile({ position: { x: newX, y: newY } });
            if (existingTile) {
                currentTile.nodes[dir] = existingTile;
                existingTile.nodes[newTileDir] = currentTile;
                if (!stay) {
                    currentTile = existingTile;
                }
            } else {
                const newTile = this.createTile(newX, newY);
                newTile.nodes[newTileDir] = currentTile;
                currentTile.nodes[dir] = newTile;
                tileMap.push(newTile);
                if (!stay) {
                    currentTile = newTile;
                }
            }
        };

        const searchTile = ({ id, position }, tile) => {
            let start = null;
            if (tile) {
                start = tile;
            } else {
                start = tileMap[0];
            }

            const visited = new Set();
            const queue = [start];

            while (queue.length > 0) {
                const tile = queue.shift();
                const nodes = tile.getNodes().filter((el) => el != null);

                for (let node of nodes) {
                    if (id) {
                        if (node.id === id) {
                            // console.log('Found matching id ' + id);
                            return node;
                        }
                    }
                    if (position) {
                        if (node.position.x === position.x && node.position.y === position.y) {
                            console.log('yes');
                            // console.log('Found matching pos ' + position.x + ', ' + position.y);
                            return node;
                        }
                    }

                    if (!visited.has(node)) {
                        visited.add(node);
                        queue.push(node);
                    }
                }
            }
            return null;
        };

        if (name === 'debug') {
            addTile('right');
            addTile('top', true);
            addTile('right');
            addTile('right');
            addTile('bot');
            addTile('left');
            addTile('top');
            updateTileSprites();
        }

        return tileMap;
    }
}
