/**
 * Player Management
 * Creates a player, whether controlled by the current player or by another.
 */


function Player(id) {
    this.id = id

    var JUMP_DURATION = 750;
    var JUMP_MAX_HEIGHT = 100;
    var FALL_SPEED = 5;

    var isJumping = false;
	var timeFinish;
	var timeStart;
	var yStart;

	this.r = 25;
	this.x = 50;
	this.y = Y - this.r;
	this.out = false;

	this.draw = function(ctx) {
	    if (!this.out) {
		    ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
		}
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
			yStart = this.y;
		}
    }

    this.updateJump = function(time) {
		if(time >= timeFinish) {
			isJumping = false;
			this.y = yStart;
			return;
		}

		var apex = {y: yStart - JUMP_MAX_HEIGHT, x: (timeFinish - timeStart)/2}
		var coeff = (yStart - apex.y) / Math.pow(apex.x, 2);
		var t = time - timeStart;

		this.y = coeff * Math.pow(t - apex.x, 2) + apex.y;
	}

	this.to_bundle = function() {
        return {
            id: this.id,
            isJumping: isJumping,
            timeFinish: timeFinish,
            timeStart: timeStart,
            yStart: yStart,
            out: this.out
        }
	}

	this.from_bundle = function(bundle) {
	    this.id = bundle.id;
	    isJumping = bundle.isJumping;
	    timeFinish = bundle.timeFinish;
	    timeStart = bundle.timeStart;
	    yStart = bundle.yStart;
	    this.out = bundle.out;
	    return this;
	}
}