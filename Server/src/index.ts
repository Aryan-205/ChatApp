import { json } from "express";
import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({port: 3030})

interface User {
  socket: WebSocket,
  room: string
}

let UserCount = 0;
let allSocket: User[] =[]

ws.on('connection',(socket)=>{

  UserCount+=1
  console.log('user connected',UserCount)

  socket.on('message',(msg)=>{
    //@ts-ignore
    const parsedMsg = JSON.parse(msg)

    if(parsedMsg.type == 'join'){
      allSocket.push({
        socket,
        room:parsedMsg.payload.roomId
      })
    }

    if(parsedMsg.type == 'chat'){
      const currentUserRoom = allSocket.find(s=>s.socket == socket)?.room

      const usersOfMyRoom = allSocket.filter(s=>s.room == currentUserRoom)

      usersOfMyRoom.forEach(u=>{
        u.socket.send(parsedMsg.payload.message)
      })
    }
  })
})