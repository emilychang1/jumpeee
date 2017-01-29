var socket = io();

socket.on('new player', function(msg) {
    document.getElementById('no-players').innerHTML = msg;
});