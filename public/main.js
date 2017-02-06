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

	var ctx = canvas.getContext("2d");
    var currentPlayerId = new Date().getTime();
    var currentPlayer = new Player(currentPlayerId);
	var players = [];

	players.push(currentPlayer);
	var level = new Level('Level 1', 100, 10, canvas.height - 10, 10, canvas.width, 0, 75);

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
            player.update(time);
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
            var currentTime = new Date().getTime();
            currentPlayer.startJump(currentTime);
            var bundles = playersToBundles(players);
            socket.emit('update players', bundles)
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