export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('user connected:', socket.id)
    const room = socket.handshake.query?.room ?? 'public'
    socket.join(room)
    console.log(socket.id, 'joined room:', room)

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
    })
    socket.on('chat.message', (message) => {
      console.log(`${socket.id}: ${message}`)
      socket.broadcast
      io.to(room).emit('chat.message', { username: socket.id, message })
    })
    socket.on('user.info', async (socketId, callback) => {
      const sockets = await io.in(socketId).fetchSockets()
      if (sockets.length === 0) return callback(null)
      const socket = sockets[0]
      const userInfo = {
        socketId,
        rooms: Array.from(socket.rooms),
      }
      return callback(userInfo)
    })
  })
}
