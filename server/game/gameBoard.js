class GameBoard {
    constructor(game, tileSpecs) {
        this._game = game;

        this._tileWidth = 50;
        this._spacing = 100;

        if (tileSpecs) {
            if (tileSpecs.width) {
                this._tileWidth = tileSpecs.width;
            }

            if (tileSpecs.spacing) {
                this._spacing = tileSpecs.spacing;
            }
        }

        this._board = [];
    }

    createBoard(name, { x, y }) {
        //Returns an array of the map tiles for the engine to run depending on map name

        const createTile = (x, y) => {
            const tile = this._game.createInstance(x, y, this._tileWidth, this._tileWidth, {
                isStatic: true,
                collisionFilter: { category: this._game.filterList.world },
            });
            tile.isSensor = true;
            tile.label = 'tile';

            tile.top = { tile: null, canMove: true };
            tile.bot = { tile: null, canMove: true };
            tile.left = { tile: null, canMove: true };
            tile.right = { tile: null, canMove: true };

            tile.getSiblings = () => {
                const siblingList = [tile.top.tile, tile.bot.tile, tile.left.tile, tile.right.tile];
                return siblingList.filter((el) => {
                    return el !== null;
                });
            };
            return tile;
        };

        let currentTile = createTile(x, y);
        this._board.push(currentTile);

        // const updateTileSprites = () => {
        //     tileMap.forEach((tile) => {
        //         tile.updateSprite();
        //     });
        // };

        const searchTile = (filter) => {
            let start = this._board[0];

            const visited = new Set();
            const queue = [start];

            while (queue.length > 0) {
                const tile = queue.shift();
                const siblings = tile.getSiblings();

                for (let node of siblings) {
                    if (filter.id) {
                        if (node.id === filter.id) {
                            // console.log('Found matching id ' + id);
                            return node;
                        }
                    }
                    if (filter.position) {
                        if (
                            node.position.x === filter.position.x &&
                            node.position.y === filter.position.y
                        ) {
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

        const addTile = (dir, stay) => {
            //Adds a tile to the map
            if (currentTile[dir].tile) {
                console.log(`A tile on the ${dir} of tile ${currentTile.id} already exists`);
                return;
            }

            let newX = currentTile.position.x,
                newY = currentTile.position.y;
            let newTileDir = '';
            switch (dir) {
                case 'right':
                    newX += this._spacing;
                    newTileDir = 'left';
                    break;
                case 'left':
                    newX -= this._spacing;
                    newTileDir = 'right';
                    break;
                case 'top':
                    newY -= this._spacing;
                    newTileDir = 'bot';
                    break;
                case 'bot':
                    newY += this._spacing;
                    newTileDir = 'top';
                    break;
                default:
                    break;
            }

            let existingTile = searchTile({ position: { x: newX, y: newY } });
            if (existingTile) {
                currentTile[dir].tile = existingTile;
                existingTile[newTileDir].tile = currentTile;
                if (!stay) {
                    currentTile = existingTile;
                }
            } else {
                const newTile = createTile(newX, newY);
                newTile[newTileDir].tile = currentTile;
                currentTile[dir].tile = newTile;
                this._board.push(newTile);
                if (!stay) {
                    currentTile = newTile;
                }
            }
        };

        const canMove = (dir, can) => {
            currentTile[dir].canMove = can;
        };

        if (name === 'debug') {
            addTile('right');
            canMove('left', false);
            addTile('top', true);
            addTile('right');
            addTile('right');
            addTile('bot');
            addTile('left');
            addTile('top');
            addTile('top');
            // updateTileSprites();
        }
    }

    get tiles() {
        return this._board;
    }

    serialize() {
        const serializedTiles = this._board.map((tile) => {
            return {
                id: tile.id,
                position: tile.position,
                vertices: tile.vertices.map((vertex) => {
                    return { x: vertex.x, y: vertex.y };
                }),
            };
        });

        return serializedTiles;
    }
}

module.exports = GameBoard;
