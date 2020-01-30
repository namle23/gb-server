const express = require('express')
const http = require('http')
const cors = require('cors')
const axios = require('axios')
const socketIo = require('socket.io')

// setup server
const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)
const io = socketIo(server)

// accept CORS
app.use(cors())

const url = 'http://tuftuf.gambitlabs.fi/feed.txt'

// setup connection for emitting data
io.on('connection', socket => {
  console.log('New client connected!')
  getDataAndEmit(socket)
  socket.on('disconnect', () => console.log('Client disconnected'))
})

// use async in case data could change
const getDataAndEmit = async socket => {
  try {
    const res = await axios.get(url)

    // form array for easy display data
    let temp = res.data.split('\n')
    socket.emit('FromData', temp)
  } catch (error) {
    console.log('Error ' + error + ' emiting data')
  }
}

server.listen(port, () => console.log('Listening on ' + port))
