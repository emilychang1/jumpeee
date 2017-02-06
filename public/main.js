window.onload = function() {

    var CONSOLE_BUNDLE = {id: 0}

    /**
     * Game Initialization
     */

    function initialize(activate_controller) {
        if (activate_controller) {
            showController();
        } else {
            hideController();
            redraw();
	    }
	    setInterval(update, 5);
    }

	var canvas = document.getElementById("canvas");
	var game_console = document.getElementById("game_console");
	var controller = document.getElementById('controller');
	var jumpButton = document.getElementById('jump-button');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	Y = canvas.height / 2;

	var ctx = canvas.getContext("2d");
    var currentPlayerId = new Date().getTime();
    var currentPlayer = new Player(currentPlayerId);
	var players = [];

	players.push(currentPlayer);
	var level = new Level('Endless', 0.5, canvas.width, 200);

	var socket = io();
	var time = new Date().getTime();
	
	var redraw = function(){ 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        level.draw(ctx);
        for (var i=0; i<players.length; i++) {
            var player = players[i];
            player.draw(ctx);
        }
		requestAnimationFrame(redraw);
	}

	function update() {
	    time = new Date().getTime();
        for (var i=0; i<players.length; i++) {
            var player = players[i];
            var currentObstacle = level.currentObstacle(player.x);
            player.update(time);

            if (currentObstacle != -1 &&
                Math.pow(Math.pow(currentObstacle.x - player.x, 2) + Math.pow(currentObstacle.y - player.y, 2), 1/2) - 10 < currentObstacle.radius) {
                player.out = true;
                syncPlayerInformation();
            }
        }
		level.update(time);
	}

	/**
	 * Players and Bundles conversions
	 */

	function playersToBundles(players) {
	    bundles = [];
	    for (var i=0;i<players.length;i++) {
	        bundles.push(players[i].to_bundle());
	    }
	    return bundles;
	}

	function bundlesToPlayers(bundles) {
	    players = [];
	    for (var i=0;i<bundles.length;i++) {
	        var bundle = bundles[i];
	        var player = new Player().from_bundle(bundle);
	        players.push(player);
	        if (currentPlayerId == bundle.id) {
                currentPlayer = player;
            }
	    }
	    return players;
	}

    /**
     * Socket Interactions with Server
     */

	socket.on('connect', function(msg) {
        connect(mobilecheck());
    });

    socket.on('update players', function(bundles) {
        players = bundlesToPlayers(bundles);
        document.getElementById('no-players').innerHTML = players.length;

        if (currentPlayer.out) {
            document.getElementById('jump-button').innerHTML = 'Retry';
        } else {
            document.getElementById('jump-button').innerHTML = 'Jump';
        }
    });

    socket.on('disconnect', function() {
        socket.emit('disconnect', currentPlayerId);
    });

    function connect(activate_controller) {
        if (activate_controller) {
            var player = new Player(currentPlayerId);
            socket.emit('new player', player.to_bundle());
        } else {
            socket.emit('new player', CONSOLE_BUNDLE);
        }
    }

    function syncPlayerInformation() {
        var bundles = playersToBundles(players);
        socket.emit('update players', bundles)
    }

    /**
     * Game controller setup
     */

    function hideController() {
        controller.style = 'display: none';
        game_console.style = 'display: block';
    }

    function showController() {
        controller.style = 'display: block';
        game_console.style = 'display: none';

        jumpButton.onmousedown = function(e) {
            if (currentPlayer.out) {
                currentPlayer.out = false;
                console.log('Retrying...');
            } else {
                var currentTime = new Date().getTime();
                currentPlayer.startJump(currentTime);
            }
            syncPlayerInformation();
        }
    }

    window.onkeypress = function(e) {
        e = e || window.event;
        if (e.key == 's') { // "s"
            initialize(true);
            connect(true);
            console.log('Activating controller...');
        }
    }

    initialize(mobilecheck());
}