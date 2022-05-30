import input from "./input.js"
import { GAME_WIDTH } from "./constants.js"

const createImage = (src) => {
    const img = new Image()
    img.src = src
    return img
}

// enviroment
const background = createImage("./assets/Background.png")

// player ships
const blueShip = createImage("./assets/blue ship.png")
const redShip = createImage("./assets/red ship.png")

// UI
class Button {
    constructor(inactiveImagePath, activeImagePath, x, y, width, height, onCLick) {
        this.activated = createImage(activeImagePath)
        this.inactivated = createImage(inactiveImagePath)
        this.current = this.inactivated
        this.position = { x, y }
        this.scale = { width, height }
        this.onCLick = onCLick
    }
    draw(ctx) {
        ctx.drawImage(this.current, this.position.x, this.position.y, this.scale.width, this.scale.height)
    }
    active() {
        this.current = this.activated
    }
    inactive() {
        this.current = this.inactivated
    }
    mouseOver() {
        return input.mouseX >= this.position.x && input.mouseX <= this.position.x + this.scale.width && input.mouseY >= this.position.y && input.mouseY <= this.position.y + this.scale.height
    }
    update(ctx) {
        const mouseOver = this.mouseOver()
        mouseOver ? this.active() : this.inactive()

        if (mouseOver && input.isMouseButtonPressed(0)) this.onCLick()

        this.draw(ctx)
    }
}

const hostButton = new Button("./assets/HOST BLUE.png", "./assets/HOST YELLOW.png", GAME_WIDTH / 2 - 220 / 2, 250, 220, 110, () => {})
const joinButton = new Button("./assets/JOIN BLUE.png", "./assets/JOIN YELLOW.png", GAME_WIDTH / 2 - 220 / 2, 400, 220, 110, () => {})

// enemies
const boss = createImage("./assets/boss.png")

// bullets
const blueBullet = createImage("./assets/bullet blue.png")
const redBullet = createImage("./assets/bullet red.png")
const bossBullet = createImage("./assets/bullet BOSS.png")

const assets = {
    blueBullet,
    redBullet,
    boss,
    hostButton,
    joinButton,
    blueShip,
    redShip,
    background,
    bossBullet
}

export default assets