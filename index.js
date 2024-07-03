const express = require('express')
const ConnectDb = require('./config/connectDB')
const env = require('dotenv').config()
const app = express()
const cors = require('cors');
const http = require('http').createServer(app)
const socketio = require('socket.io')
const router = require('./Routes/userRoutes');
const { createChat, removeUser, getUser } = require('./config/helper');
const { log } = require('util');
const roomModel = require('./models/roomModel');
const router2 = require('./Routes/roomRoutes');
const io = socketio(http)

const port = 4000 || process.env.PORT

app.use(express.json({ extended: true, limit: '500mb' }))
app.use(cors({ origin: '*' }))
app.use('/api/user', router)
app.use('/api/chatroom', router2)

io.on('connection', (socket) => {
    console.log("id one " + socket.id);

    socket.on('create-room', (name) => {
        console.log(name);
    })

    socket.on('join', async ({ name, user_id, user_texted, room_id }) => {
        const { error, users } = await createChat({
            socket_id: socket.id,
            name,
            user_id,
            user_texted,
            room_id
        })

        socket.join(room_id)

        if (error) {
            console.log('join error', error);
        } else {
            console.log('chaters', users);
        }
    })

    socket.on('sendmessage', async (message, room_id, callback) => {
        console.log('sendmessage event triggered ' + socket.id);

        try {
            const user = await getUser(socket.id)

            if (user) {
                console.log(socket.id);
                console.log('Current user:', user);

                const msgToStore = {
                    name: user.name,
                    user_id: user.user_id,
                    user_texted: user.user_texted,
                    room_id,
                    message: message
                }
                const name = user.name
                const user_id = user.user_id
                const user_texted = user.user_texted
               


                const createtext = await roomModel.create({ name, user_id, room_id, user_texted, message });
                console.log('Message to store:', msgToStore);
                console.log('Emitting message to room:', room_id);

                if (createtext) {
                    const allTexts = await roomModel.find({ room_id })
                    if (allTexts) {
                        io.to(room_id).emit('message', allTexts)
                        callback()
                    } else {
                        console.log('couldnt send all texts');
                    }

                } else {
                    console.log('couldnt create text successfully');
                }

            } else {
                console.log('error getting user');
            }

        } catch (error) {
            console.log('network error while sending mssg' + error);
        }

    })

    socket.on('disconnect', async () => {
        const user = await removeUser(socket.id)
        if (user) {
            console.log('User disconnected:', user);
        } else {
            console.log('Error removing user on disconnect');
        }
    })
});

http.listen(port, () => {
    console.log(`we are running on http://localhost:${port}`);
})

ConnectDb()
