/**
 * Player Management
 * Creates a player, whether controlled by the current player or by another.
 */


function Player(id) {
    this.id = id

    var JUMP_DURATION = 500;
    var JUMP_MAX_HEIGHT = 75;
    var FALL_SPEED = 5;

    var isJumping = false;
	var timeFinish;
	var timeStart;
	var yStart;
	this.x = 50;
	this.y = 125;
	this.r = 25;

	this.draw = function(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
    }

    this.update = function(time, currentPlatform) {
        if (currentPlatform != -1) {
            this.y = currentPlatform.y - this.r;
            if (this.y + this.r != currentPlatform.y) {
                this.y += FALL_SPEED;
            }
        }
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
            yStart: yStart
        }
	}

	this.from_bundle = function(bundle) {
	    this.id = bundle.id;
	    isJumping = bundle.isJumping;
	    timeFinish = bundle.timeFinish;
	    timeStart = bundle.timeStart;
	    yStart = bundle.yStart;
	    return this;
	}
}