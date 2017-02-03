
function Platform() {

	var x = 500;
	var y;

	this.draw = function(ctx, h) {
		ctx.rect(x, h, 50,100);
        ctx.stroke();
    }

    this.update = function(time) {
    	x = x - 10;
    }
}