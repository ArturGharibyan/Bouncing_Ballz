

class Circle {
    x: number;
    y: number;
    initialRadius: number;
    radius: number;
    velocityY: number;
    damping: number;
    color: string;
    transparency: number;
    fadeRate: number;
    shrinkRate: number;
    isFading: boolean;


    constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityY = 0;
        this.damping = 0.9;
        this.color = color;
        this.transparency = 1.0;
        this.fadeRate = 0.01; 
        this.shrinkRate = 0.1; 
        this.isFading = false; 
    }

    startFading() {
        this.isFading = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.transparency;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update(deltaTime: number) {
        this.velocityY += 0.5;
        this.y += this.velocityY;

        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocityY *= -this.damping;
        }

        if (this.isFading) {
            this. transparency -= this.fadeRate;
            if (this. transparency < 0) this. transparency = 0; 

            this.radius -= this.shrinkRate;
            if (this.radius < 0) this.radius = 0; 
        }
    }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let circles: Circle[] = [];
let fadingCircles: Circle[] = [];

function tick(currentTime: number) {
    const deltaTime = currentTime - lastTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        circle.update(deltaTime);
        circle.draw(ctx);
    });

    fadingCircles = fadingCircles.filter(circle => circle.transparency > 0 && circle.radius > 0);
    
    fadingCircles.forEach(circle => {
        circle.update(deltaTime);
        circle.draw(ctx);
    });


    lastTime = currentTime;
    requestAnimationFrame(tick);
}

let lastTime = 0;
requestAnimationFrame(tick);

canvas.addEventListener('click', (event: MouseEvent) => {
    // const radius = Math.random() * 30 + 10;
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

    if (circles.length >= 15) {
        const circleToFade = circles.shift()!;
        circleToFade.startFading();
        fadingCircles.push(circleToFade);
    }

    circles.push(new Circle(event.clientX, event.clientY, 40 /* or radius*/, color));

});

