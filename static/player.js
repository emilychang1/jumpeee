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
  
  
  var isJumping = false;
  var yStart = this.y;
  var jumpForce;

  
  this.draw = function(ctx) {
    // instead of checking isJumping, update this.y in jump
    ctx.drawImage(chickImage, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
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
    isJumping = true;
    this.y -= (this.r * 2);
    var that = this; // hack (use ES6?)
    setTimeout(function() {
      that.y += (that.r * 2);
      isJumping = false;
    }, 1000);
  }
  

}