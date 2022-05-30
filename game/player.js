import Bullet from "./bullet.js"
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js"
import Lifebar from "./lifebar.js"

const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0
}

export default class Player {
    constructor(x, y, id) {
        this.id = id
        this.position = { x, y }
        this.scale = {
            width: 60,
            height: 70
        }
        this.angle = 0
        this.speed = {
            x: 0,
            y: 0
        }
        this.maxSpeed = {
            x: 1.8,
            y: 1.8
        }
        this.spawnBulletFriction = 5
        this.spawnBulletFrameCount = 0
        this.lifebar = new Lifebar(this.position.x + this.scale.width / 2 - 5 * 15 / 2, this.position.y - 10, 15, 10, 5)
        this.bullets = []
    }
    createBullet() {
        if (this.spawnBulletFrameCount === this.spawnBulletFriction) {
            this.bullets.push(new Bullet(this.position.x + (this.scale.width / 2 - 12 / 2), this.position.y, 0, -2.5, 12, 20))
            this.spawnBulletFrameCount = 0
        } else {
            this.spawnBulletFrameCount++
        }
    }
    update() {
        if (isFloat(this.angle)) this.speed = {
            x: .5,
            y: .5
        }
        if (isFloat(this.speed.x) && isFloat(this.speed.y)) {
            this.position.x += this.speed.x * Math.cos(this.angle)
            this.position.y += this.speed.y * Math.sin(this.angle)
        } else {
            this.position.x += this.speed.x
            this.position.y += this.speed.y
        }

        if (this.position.x <= 0) this.position.x = 0
        if (this.position.x + this.scale.width >= GAME_WIDTH) this.position.x = GAME_WIDTH - this.scale.width
        if (this.position.y <= 0) this.position.y = 0
        if (this.position.y + this.scale.height >= GAME_HEIGHT) this.position.y = GAME_HEIGHT - this.scale.height

        this.bullets = this.bullets.filter(bullet => bullet.position.x + bullet.scale.width >= 0 && bullet.position.x <= GAME_WIDTH && bullet.position.y + bullet.scale.height >= 0 && bullet.position.y <= GAME_HEIGHT)

        this.bullets.forEach(bullet => {
            bullet.update()
        })

        this.lifebar.position.x = this.position.x + this.scale.width / 2 - this.lifebar.scale.width / 2
        this.lifebar.position.y = this.position.y - 12
        this.lifebar.update()
    }
}