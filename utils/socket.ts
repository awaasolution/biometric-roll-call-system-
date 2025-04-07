import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.24.244:4000"; // Replace with your server URL and port
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures a websocket connection
});

export default socket;
