var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var format = require('string-format')
var swig = require('swig');
var bodyParser = require('body-parser');

URL_FORMAT = '/g/{game_hash}'
format.extend(String.prototype, {})

var swig = new swig.Swig();
var players = 0;
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
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
  res.render('game', {game_hash: req.params.id});
});

io.on('connection', function(socket){
    players += 1;
    console.log('Players:', players);
    io.emit('new player', players);

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        players -= 1;
        console.log('Players:', players);
        io.emit('new player', players);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// http://stackoverflow.com/a/1349426/4855984
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}