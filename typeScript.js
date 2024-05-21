var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color) {
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
    Circle.prototype.startFading = function () {
        this.isFading = true;
    };
    Circle.prototype.draw = function (ctx) {
        ctx.globalAlpha = this.transparency;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };
    Circle.prototype.update = function (deltaTime) {
        this.velocityY += 0.5;
        this.y += this.velocityY;
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocityY *= -this.damping;
        }
        if (this.isFading) {
            this.transparency -= this.fadeRate;
            if (this.transparency < 0)
                this.transparency = 0;
            this.radius -= this.shrinkRate;
            if (this.radius < 0)
                this.radius = 0;
        }
    };
    return Circle;
}());
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var circles = [];
var fadingCircles = [];
function tick(currentTime) {
    var deltaTime = currentTime - lastTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function (circle) {
        circle.update(deltaTime);
        circle.draw(ctx);
    });
    fadingCircles = fadingCircles.filter(function (circle) { return circle.transparency > 0 && circle.radius > 0; });
    fadingCircles.forEach(function (circle) {
        circle.update(deltaTime);
        circle.draw(ctx);
    });
    lastTime = currentTime;
    requestAnimationFrame(tick);
}
var lastTime = 0;
requestAnimationFrame(tick);
canvas.addEventListener('click', function (event) {
    // const radius = Math.random() * 30 + 10;
    var color = "rgb(".concat(Math.random() * 255, ", ").concat(Math.random() * 255, ", ").concat(Math.random() * 255, ")");
    if (circles.length >= 15) {
        var circleToFade = circles.shift();
        circleToFade.startFading();
        fadingCircles.push(circleToFade);
    }
    circles.push(new Circle(event.clientX, event.clientY, 40 /* or radius*/, color));
});
