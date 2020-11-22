const Matter = require('matter-js');

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
        this.gameBoardTiles = [];
        this.playerList = [];

        setInterval(function () {
            Engine.update(engine, 20);
        }, 20);

        this._filterList = {
            notInteractable: 0x0001,
            interactable: 0x0002,
            world: 0x0004,
        };
    }

    createTile(x, y) {
        const colSize = 50;
        const tile = Bodies.rectangle(x, y, colSize, colSize, {
            isStatic: true,
            collisionFilter: { category: this._filterList.world },
        });
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

        tile.orientation = 'none'; //Default draw,meant for updateSprite to determine

        tile.updateSprite = () => {
            //Determines which sprite the tile should use based on siblings (Not final sprites or calculations)
            let r = tile.nodes.right,
                l = tile.nodes.left,
                u = tile.nodes.top,
                d = tile.nodes.bot;

            if (r) {
                if (l && !u && !d) {
                    tile.orientation = 'right-left';
                } else if (!l && u && !d) {
                    tile.orientation = 'right-up';
                } else if (!l && !u && d) {
                    tile.orientation = 'right-down';
                } else if (l && u && !d) {
                    tile.orientation = 'right-left-up';
                } else if (!l && u && d) {
                    tile.orientation = 'right-up-down';
                } else if (l && !u && d) {
                    tile.orientation = 'right-left-down';
                } else if (l && u && d) {
                    tile.orientation = 'right-left-up-down';
                } else {
                    tile.orientation = 'right';
                }
            } else if (l) {
                if (!u && d) {
                    tile.orientation = 'left-down';
                } else if (u && !d) {
                    tile.orientation = 'left-up';
                } else if (u && d) {
                    tile.orientation = 'left-up-down';
                } else {
                    tile.orientation = 'left';
                }
            } else if (u) {
                if (d) {
                    tile.orientation = 'up-down';
                } else {
                    tile.orientation = 'up';
                }
            } else if (d) {
                tile.orientation = 'down';
            } else {
                tile.orientation = 'null';
            }
        };

        return tile;
    }

    createBoard(name, { x, y }) {
        //Returns an array of the map tiles for the engine to run depending on map name
        const initPos = Vector.create(x, y);
        const tileMap = [];
        const inc = 100;
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

        this.gameBoardTiles.push(...tileMap);
        World.add(this.world, tileMap);
    }

    createBox({ x, y }) {
        //Test purposes
        const test = Bodies.rectangle(x, y, 50, 50);
        World.add(this.world, test);
        this.playerList.push(test);
    }

    serialize() {
        // console.log(this.gameBoardTiles);
        const serializeVertices = (vertexArray) => {
            const serializedList = vertexArray.map((vertex) => {
                return { x: vertex.x, y: vertex.y };
            });

            return serializedList;
        };

        const serializedTiles = this.gameBoardTiles.map((tile) => {
            return {
                id: tile.id,
                position: tile.position,
                vertices: serializeVertices(tile.vertices),
            };
        });

        const player = this.playerList.map((player) => {
            return {
                id: player.id,
                position: player.position,
                vertices: serializeVertices(player.vertices),
            };
        });

        //console.log(serializedTiles);
        return { tiles: serializedTiles, player };
    }
}
module.exports = Game;
