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
  var that = this; // hack
  this.isHost = false;
  var Y;
  var paused = false;
  
  var game_console;
  var controller;
  var jumpButton;
  var jumpButtonLabel;
  var idBox;
  var imgRetry;
  var imgJump;
  var noPlayers;
  var noLobbyPlayers;
  var englishPlayers;
  
  this.start = function() {
    idBox = document.getElementById('player_id');
    game_console = document.getElementById("game_console");
    controller = document.getElementById('controller');
    jumpButton = document.getElementById('jump-button');
    jumpButtonLabel = document.getElementById('jump-button-label');
    imgRetry= document.getElementById('img-retry');
    imgJump = document.getElementById('img-jump');
    noPlayers = document.getElementById('no-players');
    noLobbyPlayers = document.getElementById('lobby-no-players')
    englishPlayers = document.getElementById('english-players');
    canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    obstacle_x_start = canvas.width;
    Y = canvas.height * 3 / 4;
    ctx = canvas.getContext("2d");
    client.register(this);
    
    if (mobilecheck()) {
      client.newPlayer(sessionId);
      this.showController();
    } else {
      client.newHost(sessionId);
      updateGUILobbyWithPlayers();
      updateGUINoPlayers(players.length);
      this.hideController();
    }
  }
  
  this.addNewPlayer = function(playerId) {
    players.push(new Player(playerId * 150, Y - 50, playerId)); // TODO: replace magic number with player radius
    updateGUINoPlayers(players.length);
    updateGUILobbyWithPlayers();
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
    var player = getPlayerById(playerId);
    var i = players.indexOf(player);
    players.splice(i, 1);
    updateGUINoPlayers(players.length);
    updateGUILobbyWithPlayers();
  }
  
  this.addAllPlayersObstacles = function(allPlayersObstacles) {
    var players = allPlayersObstacles.players;
    var obstacles = allPlayersObstacles.obstacles;
    
    for (var i = 0; i < players.length; i++) {
      var playerId = players[i].id;
      this.addNewPlayer(playerId);
    }
    updateGUILobbyWithPlayers();
    updateGUINoPlayers(players.length);
    
    for (var i = 0; i < obstacles.length; i++) {
      var obstacleData = obstacles[i];
      this.addNewObstacle(obstacleData.x, obstacleData.y);
    }
  }

  function updateGUINoPlayers(no) {
    var english = (no == 1) ? 'player' : 'players';
    noPlayers.innerHTML = no;
    englishPlayers.innerHTML = english;
    noLobbyPlayers.innerHTML = no + ' ' + english;
  }

  this.updateGUIWithPlayerId = function(playerId) {
    idBox.innerHTML = 'P' + playerId;
    jumpButton.classList.remove('inactive');
    jumpButtonLabel.innerHTML = 'Tap to Jump';
    imgJump.style = 'display: inline-block';
    imgRetry.style = 'display: none';
  }

  function updateGUILobbyWithPlayers() {
    var lobbyPlayersHTML = '';
    for (var i = 0;i < players.length; i++) {
        var player = players[i];
        var color = player.ready ? 'green' : 'red';
        var status = player.ready ? 'Ready' : 'Not Ready';
        lobbyPlayersHTML += '<li><span class="status-dot bg-' + color +
            '"></span>' + player.nickname + ' <span class="status ' + color +
            '">' + status + '</span></li>';
    }
    document.getElementById('lobby-players').innerHTML = lobbyPlayersHTML;
  }

  this.ded = function() {
    imgRetry.style = 'display: inline-block';
    imgJump.style = 'display: none';
    idBox.innerHTML = '?';
    jumpButton.classList.add('retry');
    jumpButtonLabel.innerHTML = 'Died! Tap to Retry';
    this.currentPlayerId = null;
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

  function startGame() {
    paused = false;
    refresh();
    document.getElementById('url').classList.add('inactive');
    document.getElementById('start-game').innerHTML = 'Resume Game';
  }

  function pauseGame() {
    updateGUILobbyWithPlayers();
    paused = true;
    document.getElementById('url').classList.remove('inactive');
  }
  
  var last_obstacle_time = 0;
  var p_obstacles = 0.5;
  var obstacle_x_start = 0;
  
  // TODO: discard of obstacles too far away
  function update(time) {

    // spawn new obstacles
    if (that.isHost) {
        if (time - last_obstacle_time > 1500) {
            last_obstacle_time = time;
            if (Math.random() < p_obstacles) {
              var obstacle = new Obstacle(obstacle_x_start, Y);
              obstacles.push(obstacle);
              client.newObstacle(obstacle);
            }
        }
    }
    
    for (var i=0; i<players.length; i++) {
      var player = players[i];
      player.update(time);

      if (player.isInvincible()) {
        continue;
      }
      for (var j = 0; j < obstacles.length; j++) {
        var obstacle = obstacles[j];
        var d = distance(player.x, obstacle.x, player.y, obstacle.y);
        if (d < player.r + obstacle.r) {
          client.die(player.id);
          players.splice(i, 1);
          updateGUINoPlayers(players.length);
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

    ctx.beginPath();
    ctx.rect(0, Y, canvas.width, canvas.height); // TODO: replace magic number with obstacle radius
    ctx.fillStyle = "rgb(83, 71, 65)";
    ctx.fill();
    ctx.closePath();
    if (!paused) {
        requestAnimationFrame(refresh);
    }
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
        if (that.currentPlayerId == -1) {
           // pass - do nothing
        } else if (that.currentPlayerId == null) {
            client.newPlayer(that.sessionId);
            client.currentPlayerId = -1;
            imgRetry.style = 'display: none';
            imgJump.style = 'display: inline-block';
            jumpButtonLabel.innerHTML = 'Syncing with server...';
            jumpButton.classList.remove('retry');
            jumpButton.classList.add('inactive');
        } else {
            client.jump(that.currentPlayerId);
        }
      }
  }

  document.addEventListener("keydown", onKeyDown, false);
  document.getElementById('start-game').addEventListener('click', startGame, false);
  document.getElementById('help').addEventListener('click', pauseGame, false);

  function onKeyDown(e) {
    var keyCode = e.keyCode;
    if (keyCode == 83) {  // 's'
      if (!that.isHost) {
        client.newPlayer(sessionId);
        that.showController();
      } else {
        alert('You cannot convert the original host to a player! Open a new browser to convert it to a player.');
      }
    }
  }
}

function distance(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}