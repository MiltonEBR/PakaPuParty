class World {
    constructor() {
        this._entities = {};
    }

    deleteEntity(id) {
        delete this._entities[id];
    }

    verifyData(data) {
        //Verifies if the data can be transformed into an entity
        if (!data.position || !data.vertices || data.id === null || data.id === undefined) {
            return false;
        }
        return true;
    }

    createTxt(initialData) {
        const newTxt = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.font = '20px Arial';
                let x, y;
                x = this.player.position.x;
                y = this.player.position.y;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'Middle';
                ctx.fillText('Turn', x, y - 40);
            },
            index: 10,
        });
        newTxt.render.player = {
            position: { x: initialData.position.x, y: initialData.position.y },
        };

        return newTxt;
    }

    createTile(initialData) {
        const newTile = this.createEntity(initialData, {
            wireframe: true,
            strokeStyle: 'green',
            lineWidth: 2,
            index: 0,
        });

        newTile.orientation = initialData.orientation;
        return newTile;
    }

    createPlayer(initialData) {
        const newPlayer = this.createEntity(initialData, {
            wireframe: true,
            strokeStyle: initialData.color,
            lineWidth: 4,
            index: 1,
        });
        newPlayer.username = initialData.username;
        newPlayer.points = initialData.points;

        return newPlayer;
    }

    createEntity(initialData, renderSettings) {
        const { position, id } = initialData;
        if (this._entities[id]) {
            return;
        }

        const newEntity = { position, render: {} };
        if (initialData.vertices) {
            newEntity.vertices = initialData.vertices;
        }

        const render = newEntity.render;
        if (renderSettings.wireframe) {
            render.wireframe = renderSettings.wireframe;
        }
        if (renderSettings.lineWidth) {
            render.lineWidth = renderSettings.lineWidth;
        }
        if (renderSettings.strokeStyle) {
            render.strokeStyle = renderSettings.strokeStyle;
        }
        if (renderSettings.index) {
            render.index = renderSettings.index;
        } else {
            render.index = 0;
        }
        if (renderSettings.draw) {
            render.draw = renderSettings.draw;
        }

        this._entities[id] = newEntity;
        return newEntity;
    }

    updateEntity(id, data) {
        if (!this._entities[id]) {
            return;
        }

        const entity = this._entities[id];
        for (let value in data) {
            if (entity[value]) {
                entity[value] = data[value];
            }
        }

        return entity;
    }

    updateRender(id, data) {
        if (!this._entities[id]) {
            return;
        }
        const entity = this._entities[id];
        for (let value in data) {
            if (entity.render[value]) {
                console.log('in');
                entity.render[value] = data[value];
            }
        }

        return entity;
    }

    get entities() {
        return this._entities;
    }
}
