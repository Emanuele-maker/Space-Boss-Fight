import assets from "./assets.js"
import input from "./input.js"
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js"

const socket = io()
let uid, game

/** @type { HTMLCanvasElement } */

socket.on("uid", (id) => {
    uid = id
})

socket.on("gameState", state => game = state)

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let CANVAS_WIDTH
let CANVAS_HEIGHT
const ratio = 16 / 9

const resize = () => {
    CANVAS_WIDTH = window.innerWidth - 4
    CANVAS_HEIGHT = window.innerHeight - 4

    if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio) {
        CANVAS_WIDTH = CANVAS_HEIGHT * ratio
    } else {
        CANVAS_HEIGHT = CANVAS_WIDTH / ratio
    }
    canvas.style.aspectRatio = "16 / 9"

    canvas.width = GAME_WIDTH
    canvas.height = GAME_HEIGHT

    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`
    canvas.style.position = "absolute"
    canvas.style.left = "50%"
    canvas.style.top = "50%"
    canvas.style.transform = "translate(-50%, -50%)"

    ctx.font = "30px Comic Sans MS"
    ctx.textAlign = "center"
}

resize()
window.addEventListener("resize", resize)

let joystickDegAngle = 0

const drawImage = (image, object) => {
    ctx.save()
    const rad = object.angle * Math.PI / 180
    ctx.translate(object.position.x + object.scale.width / 2, object.position.y + object.scale.height / 2)
    ctx.rotate(rad)
    ctx.drawImage(image, object.scale.width / 2 * (-1), object.scale.height / 2 * (-1), object.scale.width, object.scale.height)
    ctx.restore()
}

const gameUpdate = () => {
    if (input.gamepadLeftJoystick.x !== 0 && input.gamepadLeftJoystick.y !== 0) joystickDegAngle = Math.atan2(input.gamepadLeftJoystick.y, input.gamepadLeftJoystick.x) * 180 / Math.PI

    socket.emit("input", {
        keyboard: {
            left: input.isKeyPressed(65) || input.isKeyPressed(37),
            right: input.isKeyPressed(68) || input.isKeyPressed(39),
            up: input.isKeyPressed(87) || input.isKeyPressed(38),
            down: input.isKeyPressed(83) || input.isKeyPressed(40),
            shoot: input.isKeyPressed(32) || input.isMouseButtonPressed(0)
        },
        gamepad: {
            angle: joystickDegAngle,
            speedX: input.gamepadLeftJoystick.x,
            speedY: input.gamepadLeftJoystick.y
        }
    })

    if (input.isGamepadButtonPressed(1)) socket.emit("shootBullet")

    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height)

    const clientPlayer = game.players.find(player => player.id === uid)
    const otherAlivePlayers = game.players.filter(p1 => p1 !== clientPlayer && !p1.dead)

    otherAlivePlayers.forEach(player => {
        drawImage(assets.redShip, player)
        player?.bullets.forEach(bullet => {
            drawImage(assets.redBullet, bullet)
        })
        if (player.lifebar.lives < 5) {
            ctx.fillStyle = "red"
            ctx.fillRect(player.lifebar.position.x, player.lifebar.position.y, player.lifebar.scale.width, player.lifebar.scale.height)
        }
    })

    if (clientPlayer && !clientPlayer.dead) {
        ctx.fillStyle = "white"
        drawImage(assets.blueShip, clientPlayer)
        clientPlayer.bullets.forEach(bullet => {
            drawImage(assets.blueBullet, bullet)
        })
        if (clientPlayer.lifebar.lives < 5) {
            ctx.fillStyle = "blue",
            ctx.fillRect(clientPlayer.lifebar.position.x, clientPlayer.lifebar.position.y, clientPlayer.lifebar.scale.width, clientPlayer.lifebar.scale.height)
        }
    }

    if (clientPlayer?.dead) {
        ctx.fillStyle = "white"
        ctx.fillText("Respawnerai tra 15 secondi", GAME_WIDTH / 2, GAME_HEIGHT - 70)
    }

    if (!game.boss) return
    drawImage(assets.boss, game.boss)
    game.boss.bullets.forEach(bullet => {
        drawImage(assets.bossBullet, bullet)
    })
    if (game.boss.lifebar.lives < 100) {
        ctx.fillStyle = "red"
        const lifebar = game.boss.lifebar
        ctx.fillRect(lifebar.position.x, lifebar.position.y, lifebar.scale.width, lifebar.scale.height)
    }

    const laser = game.boss.laser
    ctx.fillStyle = laser.color
    ctx.fillRect(laser.position.x, laser.position.y, laser.scale.width, laser.scale.height)
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (game) gameUpdate()

    requestAnimationFrame(render)
}
render()