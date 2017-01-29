var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var format = require('string-format')
var swig = require('swig');

URL_FORMAT = '/g/{game_hash}'

var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

format.extend(String.prototype, {})

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index', {start_url: URL_FORMAT.format({game_hash: makeid()})});
});

app.get(URL_FORMAT.format({game_hash: ':id'}), function(req , res){
  res.render('game', {game_hash: req.params.id});
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
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