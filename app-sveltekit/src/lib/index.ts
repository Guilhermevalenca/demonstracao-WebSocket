// place files you want to import through the `$lib` alias in this folder.
import { io } from "socket.io-client";

export const socket = io("localhost:3000");