const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { Game } = require('./utils/game');

game = new Game();

const {
    formatMessage,
    botName,
    userJoin,
    getRoomUsers,
    getCurrentUser,
    userLeave
} = require('./utils/chat');

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat and the game`)
            );
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // Add the new user to the game
        if (game.addPlayer(user.username)) {
            console.log("[ADD] GAME PLAYERS:", game.getPlayers());
        } else {
            console.log("[ADD] GAME PLAYERS FAILED:", game.getPlayers())
        }
        
        // When we have two players, start and tell players whose turn it is
        if (game.correctPlayerCount()) {
            console.log("CORRECT PLAYER COUNT!");

            // Reset game
            game.reset();

            // Send turn
            io.to(user.room).emit('turn', game.getPlayerTurn());
        }
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Allow players to reset the game if the game is done
    socket.on('reset', () => {
        const user = getCurrentUser(socket.id);
        
        // Reset game
        game.reset();

        // Send turn
        io.to(user.room).emit('turn', game.getPlayerTurn());
    });

    // Listen for game related event
    socket.on('choice', choice => {
        const user = getCurrentUser(socket.id);
        
        // Take a step from a player
        let res = game.step(user.username, choice);
        console.log(user.username, choice, res);

        // If the game is done, send the result
        if (game.getDone()) {
            // Send result if done
            io.to(user.room).emit('result', game.getResult());
        } else {
            // Send turn if not done
            io.to(user.room).emit('turn', game.getPlayerTurn());
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

            // Removes the user from the game
            if (game.deletePlayer(user.username)) {
                console.log("[DEL] GAME PLAYERS:", game.getPlayers());
            } else {
                console.log("[DEL] GAME PLAYERS FAILED:", game.getPlayers());
            }
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));