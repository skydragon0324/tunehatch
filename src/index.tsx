import React from "react";
import { SocketContext, socket } from "./Context/socket";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import AppControl from "./AppControl";
import "./Main.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <SocketContext.Provider value={socket}>
        <Provider store={store}>
            <AppControl />
        </Provider>
    </SocketContext.Provider>,
);
