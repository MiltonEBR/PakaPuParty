class Entities {
    constructor() {
        this.playersId = new Set();
    }

    createPlayer({ position, vertices, id }, options) {
        if (this.playersId.has(id)) {
            return;
        } else {
            this.playersId.add(id);
        }
        const newPlayer = {
            id, //Id of the player
            vertices, //List of vectors that represent vertices
            position,
            render: {}, //Position of entity
        };

        const { wireframe, lineWidth, strokeStyle } = options;
        if (wireframe) {
            newPlayer.render.wireframe = wireframe;
        }
        if (lineWidth) {
            newPlayer.render.lineWidth = lineWidth;
        }
        if (strokeStyle) {
            newPlayer.render.strokeStyle = strokeStyle;
        }

        return newPlayer;
    }
}
