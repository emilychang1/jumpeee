var bushImage = new Image();
bushImage.src = '/images/bush.png';

function Obstacle(x, y) {
  
  this.x = x;
  this.y = y;
  this.r = 50;
  this.speed = 10;
  
  this.draw = function(ctx) {
    ctx.drawImage(bushImage, this.x - this.r, this.y - this.r, this.r * 2, this.r);
  }
  
  this.update = function(time) {
    this.x -= this.speed;
  }
}