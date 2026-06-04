import { io } from "socket.io-client";

export const socket = io("https://marinecashbackend.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
});
