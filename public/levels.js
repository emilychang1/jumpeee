/**
 * Level Generator
 * Generates a series of numbers, where each number is the height of a platform.
 *
 * Usage:
 *    level = new Level('Level 1', 100, 10, 100, 10, 5);
 *    level.next();
 */

function Level(
        name,
        length,
        platform_length,
        max_height,
        max_difference,
        min_difference) {
    this.name = name;
    this.length = length;
    this.max_difference = max_difference;
    this.platform_length = platform_length;

    var current_platform_length = platform_length;
    var current_height = 0;
    var current_length = 0;

    //var currentPlatform;
    var platforms = [];


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



    this.newPlatform = function() {
        var currentPlatform = new Platform();
        platforms.push(currentPlatform);
    }

    this.newPlatform();

    this.next = function() {
        if (current_length >= length) {
            throw "Level ended."
        }
        if (current_platform_length >= this.platform_length) {
            var old_height = current_height;
            while (old_height == current_height) {
                current_platform_length = 0;
                height = max_difference - min_difference;
                delta = (Math.random() * 2 * height) - height;
                if (delta > 0) {
                    new_height = current_height + min_difference + delta;
                    current_height = Math.min(new_height, max_height);
                } else {
                    new_height = current_height - min_difference + delta;
                    current_height = Math.max(new_height, 0);
                }
            }
        }
        current_length += 1;
        current_platform_length += 1;
        return current_height;
    }

    this.has_more = function() {
        return current_length < this.length;
    }

    this.draw = function(ctx, h) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i=0; i<platforms.length; i++) {
            var platform = platforms[i];
            platform.draw(ctx, h);
        }

    }

    this.update = function(time) {
        for (var i=0; i<platforms.length; i++) {
            var platform = platforms[i];
            platform.update(time);
        }
    }
}


