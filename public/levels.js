/**
 * Level Generator
 * Generates a series of numbers, where each number is the height of a platform.
 *
 * Usage:
 *    level = new Level('Level 1', 100, 10, 2, 100, 10, 5, 10);
 *    level.next();
 */

function Level(
        name,
        length,
        platform_length,
        max_y,
        min_y,
        max_x,
        min_x,
        speed) {
    this.name = name;
    this.length = length;
    this.max_y = max_y;
    this.min_y = min_y;
    this.max_x = max_x;
    this.min_x = min_x;
    this.platform_length = platform_length;
    this.speed = speed;

    var current_platform_length = platform_length;
    var current_height = 0;
    var current_length = 0;
    var time_last_added_platform = 0;

    var block_length = 50;
    var block_height = 10;

    var level = this;
    var platforms = [];


    function Platform(x, y, speed) {
        
        this.x = level.max_x;
        this.y = y;
        this.speed = speed;
        this.last_update_time = 0;

        this.draw = function(ctx) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, block_length, block_height);
            ctx.stroke();
            ctx.closePath();
        }

        this.update = function(time) {
            if (this.last_update_time > 0) {
                this.x -= (time - this.last_update_time) / 1000 * this.speed;
            } else {
                this.x -= this.speed;
            }
            this.last_update_time = time;
        }
    }

    this.newPlatform = function() {
        var currentPlatform = new Platform(this.max_x + block_length, this.next(), this.speed);
        platforms.push(currentPlatform);
    }

    this.next = function() {
        if (current_length >= length) {
            throw "Level ended."
        }
        if (current_platform_length >= this.platform_length) {
            delta = this.max_y - this.min_y
            current_height = Math.random() * delta + this.min_y;
            current_platform_length = 0;
        }
        current_length += 1;
        current_platform_length += 1;
        return current_height;
    }

    this.has_more = function() {
        return current_length < this.length;
    }

    this.draw = function(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i=0; i<platforms.length; i++) {
            var platform = platforms[i];
            if (platform.x + block_length >= 0) {
                platform.draw(ctx);
            }
        }
    }

    this.update = function(time) {
        length_elapsed = this.speed * (time - time_last_added_platform) / 1000;
        if (length_elapsed > block_length) {
            time_last_added_platform = time;
            this.newPlatform();
        }

        for (var i=0; i<platforms.length; i++) {
            var platform = platforms[i];
            if (platform.x + block_length >= 0) {
                platform.update(time);
            }
        }
    }
}


