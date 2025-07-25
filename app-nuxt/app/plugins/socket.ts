import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            socket: io("localhost:3000"),
        },
    };
});