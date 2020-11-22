class Renderer {
    constructor(entities, canvas, options) {
        this.entities = entities;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        if (!options) {
            this.options = {};
        } else {
            this.options = options;
        }
    }

    entitiesByIndex() {
        const entitiesByIndex = {};
        for (let id in this.entities) {
            const ent = this.entities[id];
            if (!ent.render.index) {
                if (!entitiesByIndex[0]) entitiesByIndex[0] = [];
                entitiesByIndex[0].push(ent);
            } else {
                if (!entitiesByIndex[ent.render.index]) entitiesByIndex[ent.render.index] = [];
                entitiesByIndex[ent.render.index].push(ent);
            }
        }

        return entitiesByIndex;
    }

    draw() {
        const ctx = this.ctx;
        const options = this.options;

        //console.log(this.entitiesByIndex());

        for (let id in this.entities) {
            const ent = this.entities[id];
            if (ent.render.draw) {
                ent.render.draw(ctx);
            }

            let optionsWireframe =
                options.wireframes && (ent.render.wireframe || ent.render.wireframe === undefined);

            if (optionsWireframe || ent.render.wireframe) {
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
        // this.entityList.forEach((body) => {
        //     if (body.render.draw) {
        //         body.render.draw(ctx);
        //     }

        //     let optionsWireframe =
        //         options.wireframes &&
        //         (body.render.wireframe || body.render.wireframe === undefined);

        //     if (optionsWireframe || body.render.wireframe) {
        //         ctx.beginPath();
        //         ctx.moveTo(body.vertices[0].x, body.vertices[0].y);

        //         for (var j = 1; j < body.vertices.length; j += 1) {
        //             ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
        //         }
        //         ctx.closePath();
        //         ctx.lineWidth = 1;
        //         ctx.strokeStyle = 'black';
        //         if (body.render) {
        //             if (body.render.lineWidth) {
        //                 ctx.lineWidth = body.render.lineWidth;
        //             }

        //             if (body.render.strokeStyle) {
        //                 ctx.strokeStyle = body.render.strokeStyle;
        //             }
        //         }
        //         //Fill wireframes, but kind of useless so it's commented out for now
        //         //               if(body.render.fillStyle){
        //         //                   ctx.fillStyle=body.render.fillStyle;
        //         //                    ctx.fill();
        //         //                }

        //         ctx.stroke();
        //     }
        // });
    }

    run() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }
}
