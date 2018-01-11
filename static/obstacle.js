function Obstacle(x, y) {
  
  this.x = x;
  this.y = y;
  this.r = 25;
  this.speed = 5;
  
  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }
  
  this.update = function(time) {
    this.x -= this.speed;
  }
}