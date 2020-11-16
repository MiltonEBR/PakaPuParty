class WorldObjects {
    createPlayer(x, y) {
        const player = Bodies.rectangle(x, y, 50, 50);
        player.render.lineWidth = 4;
        player.render.strokeStyle = 'blue';
        return player;
    }

    createTile(x, y) {
        const tile = Bodies.rectangle(x, y, 100, 100, { isStatic: true });
        tile.isSensor = true;
        tile.render.lineWidth = 2;
        tile.render.strokeStyle = 'gray';
        tile.draw = (ctx) => {
            ctx.fillStyle = 'green';
            ctx.fillRect(tile.position.x - 25, tile.position.y - 25, 50, 50);
        };
        return tile;
    }
}
