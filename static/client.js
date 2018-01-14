function Client() {
  
  var socket = io();
  var session;
  
  this.register = function(_session) {
    session = _session;
  }
  
  socket.on('connect', function() {
    console.log(' * Connection established');
  });
  
  socket.on('missingHost', function() {
    alert('Host not found.');
  });
  
  socket.on('hostFull', function() {
    alert('Host has received maximum number of players.');
  });
  
  socket.on('currentPlayerId', function(playerId) {
    session.currentPlayerId = playerId;
    session.updateGUIWithPlayerId(playerId);
  });
  
  socket.on('newPlayer', function(player) {
    if (player.sessionId == session.sessionId) {
      console.log(' * Adding new player.');
      session.addNewPlayer(player.id);
    }
  });

  socket.on('ready', function(player) {
    if (player.sessionId == session.sessionId) {
      console.log(' * Make player ready.');
      session.removeInvincibility(player.id);
    }
  })

  socket.on('newObstacle', function(obstacle) {
    if (obstacle.sessionId == session.sessionId) {
        console.log(' * Adding new obstacle.');
        session.addNewObstacle(obstacle.x, obstacle.y);
    }
  });
  
  socket.on('removePlayer', function(player) {
    if (player.sessionId == session.sessionId) {
      console.log(' * Removing player.');
      session.removePlayer(player.id);
    }
  });
  
  socket.on('jump', function(player) {
    if (player.sessionId == session.sessionId) {
      var player = session.getPlayerById(player.id);
      if (player != null) {
        player.jump();
      } // TODO: error handling?
    }
  });
  
  socket.on('die', function(player) {
    if (player.sessionId == session.sessionId
        && session.currentPlayerId == player.id) {
      session.ded();
    }
  });

  socket.on('newHostCreated', function() {
    console.log(' * New host created.');
    session.isHost = true;
  });

  socket.on('allPlayersObstacles', function(allPlayersObstacles) {
    console.log(' * Loaded old host. Received all players and obstacles');
    session.addAllPlayersObstacles(allPlayersObstacles);
    session.isHost = false;
  });
  
  this.newPlayer = function(sessionId) {
    console.log(' * Placing request for new player / sessionId: ' + sessionId);
    socket.emit('newPlayer', sessionId);
  }

  this.playerReady = function(playerId) {
    socket.emit('playerReady', playerId);
  }
  
  this.newHost = function(sessionId) {
    socket.emit('newHost', sessionId);
  }
  
  this.newObstacle = function(obstacle) {
    socket.emit('newObstacle', {x: obstacle.x, y: obstacle.y});
  }
  
  this.jump = function(playerId) {
    socket.emit('jump', playerId);
  }
  
  this.die = function(playerId) {
    socket.emit('die', playerId);
  }
}