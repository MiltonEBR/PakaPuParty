class Renderer{
    constructor({bodies},canvas,options){
        this.bodies=bodies;
        this.canvas=canvas;
        this.ctx=canvas.getContext('2d');

        if(!options){
            this.options={};
        }else{
            this.options=options;
        }
    }

    draw(){
        const ctx=this.ctx;
        const options=this.options;

        this.bodies.forEach(body => {
            let optionsWireframe = options.wireframes && (body.render.wireframe || body.render.wireframe===undefined);
            


            if(optionsWireframe || body.render.wireframe){
                ctx.beginPath();
                ctx.moveTo(body.vertices[0].x,body.vertices[0].y);

                for (var j = 1; j < body.vertices.length; j += 1) {
                    ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
                }
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                if(body.render){
                    if(body.render.lineWidth){
                        ctx.lineWidth=body.render.lineWidth;
                    }
    
                    if(body.render.strokeStyle){
                        ctx.strokeStyle=body.render.strokeStyle;
                    }
                }
                //Fill wireframes, but kind of useless so it's commented out for now
//               if(body.render.fillStyle){
//                   ctx.fillStyle=body.render.fillStyle;
//                    ctx.fill();
//                }

                ctx.stroke();
            }

            if(body.draw){
                body.draw(ctx);
            }
        });
    }

    run(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }
}