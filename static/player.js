/**
 * Player Management
 * Creates a player, whether controlled by the current player or by another.
 */

var chickImage = new Image();
chickImage.src = '/images/chick.png';

function Player(x, y, id) {

  this.x = x;
  this.y = y;
  this.r = 60;
  this.id = id;
  this.ready = false; 
  this.nickname = 'P' + id;  // not currently set by player
  
  var isJumping = false;
  var yStart = this.y;
  var jumpForce;
  var invincible = false; 

  this.isInvincible = function() {
    return !this.ready || invincible;
  }

  this.makeInvincible = function() {
    invincible = true;
  }

  // not guaranteed to make not invicible. If the player is not ready, the
  // player will still be invicible;
  this.unInvincible = function() {
    invincible = false;
  }
  
  this.draw = function(ctx) {
    // instead of checking isJumping, update this.y in jump
    ctx.beginPath();
    ctx.moveTo(this.x - 12, this.y - this.r - 20);
    ctx.lineTo(this.x + 12, this.y - this.r - 20);
    ctx.lineTo(this.x, this.y - this.r - 5);
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.font="25px Saira Extra Condensed";
    ctx.fillText('P' + this.id, this.x - 10, this.y - this.r - 30);

    if (this.isInvincible()) {
        ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(chickImage, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    ctx.globalAlpha = 1;
  }
  
  /**
   * Called once every frame, to update the player object.
   */
  this.update = function(time) {
  }
  
  document.addEventListener("keydown", keyDownTextField, false);

  function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13) {
    isJumping = true;
    }  
  }
  
  document.addEventListener("keyup", keyUpTextField, false);
  function keyUpTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13) {
    isJumping = false;
      console.log(0);
    }  
  }
  
  this.jump = function() {
    if (isJumping) {
      return;
    }
    isJumping = true;
    this.y -= (this.r * 2);
    var that = this; // hack (use ES6?)
    setTimeout(function() {
      that.y += (that.r * 2);
      isJumping = false;
    }, 1250);
  }
  

}