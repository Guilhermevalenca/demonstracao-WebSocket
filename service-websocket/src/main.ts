import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: '*',
    }
});

interface IMessage {
    name: string;
    message: string;
}

const allMessages: IMessage[] = [];

io.on("connection", (socket) => {
    socket.on('chat', (data) => {
        if(data.message && data.name) {
            allMessages.push(data);
            io.emit('chat', data);
        }
    });

    socket.on('all-messages', () => {
        socket.emit('all-messages', allMessages);
    });
});

io.listen(3000);
console.log('listening on *:3000');
