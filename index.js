const express = require('express');
const ConnectDb = require('./config/connectDB');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const socketio = require('socket.io');
const router = require('./Routes/userRoutes');
const { createChat, removeUser, getUser } = require('./config/helper');
const roomModel = require('./models/roomModel');
const router2 = require('./Routes/roomRoutes');
const io = socketio(http);

const port = process.env.PORT || 4000;

app.use(express.json({ extended: true, limit: '500mb' }));
app.use(cors({ origin: '*' }));
app.use('/api/user', router);
app.use('/api/chatroom', router2);

io.on('connection', (socket) => {
    console.log("Client connected: " + socket.id);

    socket.on('create-room', (name) => {
        console.log("Room created with name: ", name);
    });

    socket.on('join', async ({ name, user_id, user_texted, room_id }) => {
        try {
            const { error, users } = await createChat({
                socket_id: socket.id,
                name,
                user_id,
                user_texted,
                room_id
            });

            if (error) {
                console.log('Join error:', error);
            } else {
                socket.join(room_id);
                console.log('Chat users:', users);
            }
        } catch (err) {
            console.log('Join error:', err);
        }
    });

    socket.on('sendmessage', async (message, room_id, callback) => {
        console.log('Send message event triggered by socket:', socket.id);

        try {
            const user = await getUser(socket.id);

            if (user) {
                console.log('Current user:', user);

                const msgToStore = {
                    name: user.name,
                    user_id: user.user_id,
                    user_texted: user.user_texted,
                    room_id,
                    message
                };

                const createtext = await roomModel.create(msgToStore);
                console.log('Message to store:', msgToStore);
                console.log('Emitting message to room:', room_id);

                if (createtext) {
                    const allTexts = await roomModel.find({ room_id });
                    if (allTexts) {
                        io.to(room_id).emit('message', allTexts);
                        callback();
                    } else {
                        console.log('Could not retrieve all texts');
                    }
                } else {
                    console.log('Could not create text successfully');
                }
            } else {
                console.log('Error getting user');
            }
        } catch (error) {
            console.log('Network error while sending message:', error);
        }
    });

    socket.on('disconnect', async () => {
        try {
            const user = await removeUser(socket.id);
            if (user) {
                console.log('User disconnected:', user);
            } else {
                console.log('Error removing user on disconnect');
            }
        } catch (err) {
            console.log('Error during disconnection:', err);
        }
    });
});

http.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

ConnectDb();
