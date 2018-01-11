function Session(sessionId) {
  var canvas;
  var ctx;
  var sessionId = sessionId;
  this.sessionId = sessionId;
  var players = [];
  var obstacles = [];
  var client = new Client();
  var time = new Date().getTime();
  this.currentPlayerId = -1;
  
  var game_console;
	var controller;
	var jumpButton;
  
  this.start = function() {
    game_console = document.getElementById("game_console");
    controller = document.getElementById('controller');
    jumpButton = document.getElementById('jump-button');
    canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    obstacle_x_start = canvas.width;
    ctx = canvas.getContext("2d");
    client.register(this);
    
    if (mobilecheck()) {
      client.newPlayer(sessionId);
      this.showController();
    } else {
      client.newHost(sessionId);
      refresh();
      this.hideController();
    }
  }
  
  this.addNewPlayer = function(playerId) {
    players.push(new Player(playerId * 50, canvas.height / 2, playerId));
  }
  
  this.addNewObstacle = function(obstacle_x, obstacle_y) {
    obstacles.push(new Obstacle(obstacle_x, obstacle_y));
  }
  
  this.getPlayerById = function(playerId) {
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (player.id == playerId) {
        return player;
      }
    }
    return null;
  }
  
  this.removePlayer = function(playerId) {
    players.splice(playerId - 1, 1);
  }
  
  this.addAllPlayersObstacles = function(allPlayersObstacles) {
    var players = allPlayersObstacles.players;
    var obstacles = allPlayersObstacles.obstacles;
    
    for (var i = 0; i < players.length; i++) {
      var playerId = players[i].id;
      this.addNewPlayer(playerId);
    }
    
    for (var i = 0; i < obstacles.length; i++) {
      var obstacleData = obstacles[i];
      this.addNewObstacle(obstacleData.x, obstacleData.y);
    }
  }
  
  function draw(ctx) {
    for (var i=0; i<players.length; i++) {
      var player = players[i];
      player.draw(ctx);
    }
    
    for (var i=0; i<obstacles.length; i++) {
      var obstacle = obstacles[i];
      obstacle.draw(ctx);
    }
  }
  
  var last_obstacle_time = 0;
  var p_obstacles = 0.5;
  var obstacle_x_start = 0;
  
  // TODO: discard of obstacles too far away
  function update(time) { 

    // spawn new obstacles
    if (time - last_obstacle_time > 1000) {
        last_obstacle_time = time;
        if (Math.random() < p_obstacles) {
          var obstacle = new Obstacle(obstacle_x_start, canvas.height / 2);
          obstacles.push(obstacle);
          client.newObstacle(obstacle);
        }
    }
    
    for (var i=0; i<players.length; i++) {
      var player = players[i];
      player.update(time);
      
      for (var j = 0; j < obstacles.length; j++) {
        var obstacle = obstacles[j];
        var d = distance(player.x, obstacle.x, player.y, obstacle.y);
        if (d < player.r + obstacle.r) {
          client.die(player.id);
          players.splice(i, 1);
          break;
        }
      }
    }
    
    for (var i=0; i<obstacles.length; i++) {
      var obstacle = obstacles[i];
      obstacle.update(time);
    }
  }
  
  function refresh() {
    time = new Date().getTime();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update(time);
    draw(ctx);
    requestAnimationFrame(refresh);
  }
  
  /**
   * Game controller setup
   */
  
  this.hideController = function() {
      controller.style = 'display: none';
      game_console.style = 'display: block';
  }

  this.showController = function() {
      controller.style = 'display: block';
      game_console.style = 'display: none';
      var that = this;

      jumpButton.onmousedown = function(e) {
        client.jump(that.currentPlayerId);
      }
  }
}

function distance(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}