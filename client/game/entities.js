class Entities {
    constructor() {
        this._entityList = {};
    }

    verifyData(data) {
        //Verifies if the data can be transformed into an entiry
        if (!data.position || !data.vertices || data.id === null || data.id === undefined) {
            return false;
        }
        return true;
    }

    createEntity(initialData, options) {
        const { position, vertices, id } = initialData;
        if (this._entityList[id]) {
            return;
        }

        const newEntity = { position, vertices, render: {} };

        const { wireframe, lineWidth, strokeStyle, index } = options;

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

        this._entityList[id] = newEntity;
        return newEntity;
    }

    updateEntity(id, data) {
        if (!this._entityList[id]) {
            return;
        }

        const entity = this._entityList[id];
        for (let value in data) {
            if (entity[value]) {
                entity[value] = data[value];
            }
        }

        return entity;
    }

    get entityList() {
        return this._entityList;
    }
}
