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

    createPlayer(x, y) {
        const player = Bodies.rectangle(x, y, 50, 50, {
            collisionFilter: {
                category: this._filterList.notInteractable,
            },
        });
        player.render.lineWidth = 4;
        player.render.strokeStyle = 'blue';
        return player;
    }

    createTile(x, y, towards) {
        const tile = Bodies.rectangle(x, y, 100, 100, { isStatic: true });
        tile.isSensor = true;
        tile.render.lineWidth = 2;
        tile.render.strokeStyle = 'gray';
        tile.draw = (ctx) => {
            switch (towards) {
                case 'null':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 50);
                    break;
                case 'up':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 25, tile.position.y - 50, 50, 100);
                    break;
                case 'side':
                    ctx.fillStyle = 'green';
                    ctx.fillRect(tile.position.x - 50, tile.position.y - 25, 100, 50);
                    break;

                default:
                    break;
            }
        };
        return tile;
    }
}
