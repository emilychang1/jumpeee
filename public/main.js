
window.onload = function() {

	var canvas = document.getElementById("canvas"); 
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var ctx = canvas.getContext("2d"); 
	var isJumping = false;
	var time = 0;
	var timeFinish;
	var timeStart;
	var yStart;
	var c = {  
		x:5, 
		y:125, 
		r:25 
	}
	
	var redraw = function(){ 
		ctx.clearRect(0, 0, canvas.width, canvas.height); 
		ctx.beginPath();  
		ctx.arc(c.x, c.y, c.r, 0, Math.PI*2); 
		ctx.closePath(); 
		ctx.fill(); 
		requestAnimationFrame(redraw);
	}

	function update(){
		c.x = c.x + 1;
		time = time + 10; 

		if (isJumping == true) {
			jump()
		}
	}
	
	window.onkeypress = function(e) {
		if (isJumping == false) {
			isJumping = true;
			timeStart = time;
			timeFinish = timeStart + 1000;
			yStart = c.y;
		}
	}

	function jump(){
		if(time >= timeFinish) {
			isJumping = false;
		}
		console.log(time, timeFinish);
		var height = -((timeFinish - timeStart)/2 + timeStart - time)/100; 
		c.y = c.y + height;
	}

	redraw(); 
	setInterval(update, 10); 

}