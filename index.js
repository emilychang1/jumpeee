var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var format = require('string-format')
var swig = require('swig');
var bodyParser = require('body-parser');

const URL_FORMAT = '/jumpeee/{game_hash}'
const BASE_URL = 'eemily.com'
format.extend(String.prototype, {})

var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
   res.render('index', {start_url: URL_FORMAT.format({game_hash: makeid()})});
});

app.get('/join', function(req, res) {
    res.render('join')
});

app.post('/join', function(req, res) {
    res.writeHead(301, {
        Location: "http" + (req.socket.encrypted ? "s" : "") + "://" +
            req.headers.host + URL_FORMAT.format({game_hash: req.body.game_hash})
        });
    res.end();
});

app.get(URL_FORMAT.format({game_hash: ':id'}), function(req , res){
    res.render('game', {
        game_hash: req.params.id,
        url_prefix: BASE_URL + URL_FORMAT.format({game_hash: ''})
    });
});

var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on *:', port);
});

// http://stackoverflow.com/a/1349426/4855984
function makeid() {
     var text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for( var i=0; i < 5; i++ )
         text += possible.charAt(Math.floor(Math.random() * possible.length));

     return text;
}

var sessions = {};
var maxPlayersPerSession = 4;
// TODO: use namespaces
// TODO: emit to hosts only
io.on('connection', function(socket) {
  
  socket.on('newPlayer', function(sessionId) {
    if (sessionId in sessions) {
      var session = sessions[sessionId];
      var playerId = getNewPlayerId(session);
      if (playerId == -1) {
        socket.emit('hostFull');
      } else {
        socket.player = {
          id: playerId,
          sessionId: sessionId
        };
        session.players.splice(playerId, 0, socket.player);
        socket.emit('currentPlayerId', playerId);
        socket.broadcast.emit('newPlayer', socket.player);
        
        socket.on('jump', function(playerId) {
          var session = sessions[socket.player.sessionId];
          var player = findPlayerById(socket.player.id, session);  
          if (player != null) {
            socket.broadcast.emit('jump', player);
          }
        });
        
        socket.on('disconnect', function() {
          var session = sessions[socket.player.sessionId];
          var players = session.players;
          var i = players.indexOf(socket.player);
          players.splice(i, 1);
          io.emit('removePlayer', socket.player);
        });
      }
    } else {
      socket.emit('missingHost');
    }
  });
  
  socket.on('newHost', function(sessionId) {
    if (sessionId in sessions) {
      socket.emit('allPlayersObstacles', sessions[sessionId]);
    } else {
      socket.host = sessions[sessionId] = {
        'players': [],
        'obstacles': []
      }
      socket.emit('newHostCreated');
      
      socket.on('die', function(playerId) {
        var player = findPlayerById(playerId, socket.host);
        if (player != null) {
          socket.broadcast.emit('die', player);
        }
      });
      
      socket.on('newObstacle', function(bundle) {
        socket.host.obstacles.push(bundle);
        bundle.sessionId = sessionId;
        socket.broadcast.emit('newObstacle', bundle);
      });
    }
  });
});

function getNewPlayerId(session) {
  if (session.players.length == 0) {
    return 1;
  }
  for (var i = 0; i < session.players.length; i++) {
    var player = session.players[i];
    if (player.id - 1 > i) {
      return i;
    }
  }
  return -1;
}

function findPlayerById(playerId, session) {
  for (var i = 0; i < session.players.length; i++) {
    var player = session.players[i];
    if (player.id == playerId) {
      return player;
    }
  }
  return null;
}