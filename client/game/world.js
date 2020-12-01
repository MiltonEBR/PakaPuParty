class World {
    constructor() {
        this._entities = {};
    }

    verifyData(data) {
        //Verifies if the data can be transformed into an entity
        if (!data.position || !data.vertices || data.id === null || data.id === undefined) {
            return false;
        }
        return true;
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
        const getRandomColor = () => {
            //PROVISIONAL TO DIFERENTIATE PLAYERS
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        const newPlayer = this.createEntity(initialData, {
            wireframe: true,
            strokeStyle: getRandomColor(),
            lineWidth: 4,
            index: 1,
        });
        newPlayer.username = initialData.username;
        newPlayer.points = initialData.points;

        return newPlayer;
    }

    createEntity(initialData, renderSettings) {
        const { position, vertices, id } = initialData;
        if (this._entities[id]) {
            return;
        }

        const newEntity = { position, vertices, render: {} };

        const { wireframe, lineWidth, strokeStyle, index } = renderSettings;

        const render = newEntity.render;
        if (wireframe) {
            render.wireframe = wireframe;
        }
        if (lineWidth) {
            render.lineWidth = lineWidth;
        }
        if (strokeStyle) {
            render.strokeStyle = strokeStyle;
        }
        if (index) {
            render.index = index;
        } else {
            render.index = 0;
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

    get entities() {
        return this._entities;
    }
}
