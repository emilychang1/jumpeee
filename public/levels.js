var Y;

function Level(
        name,
        p_obstacles,
        max_x,
        speed) {

    var BLOCK_RADIUS = 30;

    this.name = name;
    this.max_x = max_x;
    this.p_obstacles = p_obstacles;
    this.speed = speed;

    var last_obstacle = 0;
    var level = this;
    var obstacles = [];

    function Obstacle() {

        this.x = level.max_x;
        this.y = Y;
        this.last_update_time = 0;
        this.radius = BLOCK_RADIUS;

        this.draw = function(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, Y, BLOCK_RADIUS, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        }

        this.update = function(time) {
            if (this.last_update_time > 0) {
                this.x -= (time - this.last_update_time) / 1000 * level.speed;
            } else {
                this.x -= level.speed;
            }
            this.last_update_time = time;
        }
    }

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.rect(0, Y, this.max_x, 100);
        ctx.fill();
        ctx.closePath();

        for (var i=0; i<obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (obstacle.x + BLOCK_RADIUS >= 0) {
                obstacle.draw(ctx);
            }
        }
    }

    this.update = function(time) {
        if (time - last_obstacle > 1000) {
            last_obstacle = time;
            if (Math.random() < this.p_obstacles) {
                obstacles.push(new Obstacle());
            }
        }

        for (var i=0; i<obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (obstacle.x + BLOCK_RADIUS >= 0) {
                obstacle.update(time);
            }
        }
    }
    
    /**
     * Handles players
     */

    this.currentObstacle = function(x) {
        for (var i=0; i<obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (obstacle.x - BLOCK_RADIUS <= x && x <= obstacle.x + BLOCK_RADIUS) {
                return obstacle;
            }
        }
        return -1;
    }

}