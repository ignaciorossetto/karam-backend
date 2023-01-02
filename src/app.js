import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import productRouters from './routes/products.router.js'
import mercadopagoRouters from './routes/mercadopago.router.js'
import cartRouter from './routes/carts.router.js'
import __dirname from './utils.js'
import {Server} from 'socket.io'
import http from 'http'



const PORT = 5000
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:'http://localhost:3000'
    }
})


// io.on('connection', (socket)=> {
//     console.log('user Connected app')

//     socket.on('home', ()=>{
//         console.log('estamos en home');
//     })
// })


// // Set socket.io
// app.set("io", io)


// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Static files
app.use('/static', express.static('public'))

// Routes
app.use('/api/products', productRouters)
app.use('/api/mercadopago', mercadopagoRouters)
app.use('/api/carts', cartRouter)


server.listen(PORT, ()=> {
    console.log(`Listening on port: ${PORT}`);
})

