import React from "react";
import socketio from "socket.io-client";
import { SERVER_URL } from "../Helpers/configConstants";

// pubgenius seems there's no use case for this on...
export const socket: any = null;
// socketio.connect(SERVER_URL);
export const SocketContext = React.createContext(null);
