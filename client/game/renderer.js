class Renderer{
    constructor({bodies},canvas){
        this.bodies=bodies;
        this.canvas=canvas;
        this.ctx=canvas.getContext('2d');
    }

    draw(){
        const ctx=this.ctx;
        this.bodies.forEach(body => {
            body.draw(ctx);
        });
    }

    run(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }
}