const net = require('net')

const response = `
Hello word
`
const server= net.createServer(socket=>{
    socket.end(response)
})

server.listen(80,(err)=>{
    console.log('err',err);
})