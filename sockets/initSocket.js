import { Socket } from "./index.js";
import { setSocketInstance } from "./socketInstance.js";

export default function initSocketIO(server) {
  const socketService = new Socket(server);
  setSocketInstance(socketService);
}
