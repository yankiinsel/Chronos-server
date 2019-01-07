const app = require('http').createServer((req, res) => {
    res.writeHead(500)
    res.end("failed")
});
const server = app.listen(8080, function() {
    console.log('listening to localhost:8080');
});
const io = require('socket.io')(server);

const sockets = {};

var currentRoom;

io.on('connection', (socket) => {
    sockets[socket.id] = socket;

    socket.on('disconnect', () => {
        delete sockets[socket.id];
    });

    socket.on('startPauseButtonHandler', (data) => {
        let room = data[0];
        let timer = data[1]
        io.sockets.in(room).emit('startPauseButtonHandler', timer);
    });

    socket.on('cancelButtonHandler', (room) => {
        io.sockets.in(room).emit('cancelButtonHandler');
    });

    socket.on('room', (room) => {
        if (currentRoom) {
            socket.leave(currentRoom);
        }

        socket.join(room);
        currentRoom = room
    });
});

process.stdin.on('data', (buf) => {
    for (id in sockets) {
        sockets[id].emit('message', String(buf));
    }
});