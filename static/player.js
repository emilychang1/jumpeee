/**
 * Player Management
 * Creates a player, whether controlled by the current player or by another.
 */

function Player(x, y, id) {

  this.x = x;
  this.y = y;
  this.r = 25;
  this.id = id;
  
  
  var isJumping = false;
  var yStart = this.y;
  var jumpForce;

  
  this.draw = function(ctx) {
		ctx.beginPath();
    if (isJumping) {
      ctx.arc(this.x, this.y - 50, this.r, 0, Math.PI*2);
    } else {
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    }
    ctx.fill();
    ctx.closePath();
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
    setTimeout(function() {
      isJumping = false;
    }, 1000);
  }
  

}