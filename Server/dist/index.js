"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const ws = new ws_1.WebSocketServer({ port: 3030 });
let UserCount = 0;
let allSocket = [];
ws.on('connection', (socket) => {
    UserCount += 1;
    console.log('user connected', UserCount);
    socket.on('message', (msg) => {
        var _a;
        //@ts-ignore
        const parsedMsg = JSON.parse(msg);
        if (parsedMsg.type == 'join') {
            allSocket.push({
                socket,
                room: parsedMsg.payload.roomId
            });
        }
        if (parsedMsg.type == 'chat') {
            const currentUserRoom = (_a = allSocket.find(s => s.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            const usersOfMyRoom = allSocket.filter(s => s.room == currentUserRoom);
            usersOfMyRoom.forEach(u => {
                u.socket.send(parsedMsg.payload.message);
            });
        }
    });
});
