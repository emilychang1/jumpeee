/**
 * Player Management
 * Creates a player, whether controlled by the current player or by another.
 */


JUMP_DURATION = 500;
JUMP_SCALING = 2;


function Player() {
    var isJumping = false;
	var timeFinish;
	var timeStart;
	var yStart;
	var x = 50;
	var y = 125;
	var r = 25;

	this.draw = function(ctx) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2);
		ctx.closePath();
		ctx.fill();
    }

    this.update = function(time) {
        if (isJumping == true) {
			this.updateJump(time);
		}
    }

    this.startJump = function(time) {
        if (isJumping == false) {
			isJumping = true;
			timeStart = time;
			timeFinish = timeStart + JUMP_DURATION;
			yStart = y;
		}
    }

    this.updateJump = function(time){
		if(time >= timeFinish) {
			isJumping = false;
			y = yStart;
			return;
		}
		var height = -((timeFinish - timeStart)/2 + timeStart - time)/100 * 2;
		//console.log(y, y + height);
		y = y + height;
	}
}