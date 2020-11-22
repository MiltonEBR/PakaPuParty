class Renderer {
    constructor({ entityList }, canvas, options) {
        this.entityList = entityList;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        if (!options) {
            this.options = {};
        } else {
            this.options = options;
        }
    }

    draw() {
        const ctx = this.ctx;
        const options = this.options;
        for (let entity in this.entityList) {
            const body = this.entityList[entity];
            if (body.render.draw) {
                body.render.draw(ctx);
            }

            let optionsWireframe =
                options.wireframes &&
                (body.render.wireframe || body.render.wireframe === undefined);

            if (optionsWireframe || body.render.wireframe) {
                ctx.beginPath();
                ctx.moveTo(body.vertices[0].x, body.vertices[0].y);

                for (var j = 1; j < body.vertices.length; j += 1) {
                    ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
                }
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                if (body.render) {
                    if (body.render.lineWidth) {
                        ctx.lineWidth = body.render.lineWidth;
                    }

                    if (body.render.strokeStyle) {
                        ctx.strokeStyle = body.render.strokeStyle;
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
