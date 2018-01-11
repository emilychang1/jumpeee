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
  });
  
  socket.on('newPlayer', function(player) {
    if (player.sessionId == session.sessionId) {
      console.log(' * Adding new player.');
      session.addNewPlayer(player.id);
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
      alert('Oops, player died. Try again?');
      this.newPlayer(session.sessionId);
    }
  });
  
  socket.on('newHostCreated', function() {
    console.log(' * New host created.');
  });
  
  socket.on('allPlayersObstacles', function(allPlayersObstacles) {
    console.log(' * Loaded old host. Received all players and obstacles');
    session.addAllPlayersObstacles(allPlayersObstacles);
  });
  
  this.newPlayer = function(sessionId) {
    console.log(' * Placing request for new player / sessionId: ' + sessionId);
    socket.emit('newPlayer', sessionId);
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