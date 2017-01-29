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
}