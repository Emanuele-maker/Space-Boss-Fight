import { Server as SocketServer } from "socket.io"
import express from "express"
import { createServer } from "http"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import Game from "./game/game.js"
import { config } from "dotenv"

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new SocketServer(server)

app.use(express.static(join(__dirname, "/client")))

let game = new Game(), interval

io.on("connection", socket => {
    const uid = socket.id
    console.log(`A client just connected! Client UID: ${uid}`)

    socket.emit("uid", uid)

    const player = game.createPlayer(uid)

    socket.on("input", ({keyboard, gamepad}) => {
        player.angle = gamepad.angle
        player.speed = {
            x: gamepad.speedX * player.maxSpeed.x,
            y: gamepad.speedY * player.maxSpeed.y
        }
        if (keyboard.left) {
            player.speed.x = -player.maxSpeed.x
            player.angle = 270
        }
        else if (keyboard.right) {
            player.speed.x = player.maxSpeed.x
            player.angle = 90
        }
        else player.speed.x = 0

        if (keyboard.up) {
            player.speed.y = -player.maxSpeed.y
            player.angle = 0
        }
        else if (keyboard.down) {
            player.speed.y = player.maxSpeed.y
            player.angle = 180
        }
        else player.speed.y = 0

        if (keyboard.shoot) player.createBullet()
    })

    socket.on("shootBullet", () => {
        player.createBullet()
    })

    const gameInterval = () => {
        interval = setInterval(() => {
            game.update()
            io.emit("gameState", game)
        }, process.env.NODE_ENV === "production" ? 4 : 0)
    }

    if (io.sockets.sockets.size === 1) gameInterval()

    socket.on("disconnect", reason => {
        game.deletePlayer(uid)
        if (io.sockets.sockets.size === 0) {
            clearInterval(interval)
            game = new Game()
        }
        console.log(`A client with UID "${uid}" just disconnected. Reason:`, reason)
    })
})

server.listen(PORT, () => console.log(`Server started on Port ${PORT}`))