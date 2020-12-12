class Renderer {
    constructor(entities, canvas, options) {
        this._entities = entities;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        if (!options) {
            this.options = {};
        } else {
            this.options = options;
        }
    }

    entitiesByIndex(entitiesById) {
        for (id in entitiesById) {
            const entity = entitiesById[id];
            if (!this._entitiesRenderer[entity.render.index]) {
                this._entitiesRenderer[entity.render.index] = [];
            }
            this._entitiesRenderer[entity.render.index].push(entity.render);
        }

        console.log(this._entitiesRenderer);
    }

    draw() {
        const ctx = this.ctx;
        const options = this.options;

        const entityList = Object.values(this._entities);
        entityList.sort((a, b) => a.render.index - b.render.index); //Most eficient sort method?

        for (let ent of entityList) {
            if (ent.render.hide) {
                continue;
            }

            if (ent.render.draw) {
                ent.render.draw(ctx);
            }

            let optionsWireframe =
                options.wireframes && (ent.render.wireframe || ent.render.wireframe === undefined);

            if ((optionsWireframe || ent.render.wireframe) && ent.vertices) {
                ctx.beginPath();
                ctx.moveTo(ent.vertices[0].x, ent.vertices[0].y);

                for (var j = 1; j < ent.vertices.length; j += 1) {
                    ctx.lineTo(ent.vertices[j].x, ent.vertices[j].y);
                }
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                if (ent.render) {
                    if (ent.render.lineWidth) {
                        ctx.lineWidth = ent.render.lineWidth;
                    }

                    if (ent.render.strokeStyle) {
                        ctx.strokeStyle = ent.render.strokeStyle;
                    }
                }
                //Fill wireframes, but kind of useless so it's commented out for now
                //               if(body.render.fillStyle){
                //                   ctx.fillStyle=body.render.fillStyle;
                //                    ctx.fill();
                //                }

                ctx.stroke();
            }
        }
    }

    run() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }
}
