import Bullet from "./bullet.js"
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js"
import Lifebar from "./lifebar.js"

export default class Boss {
    constructor() {
        this.scale = {
            width: 180,
            height: 166
        }
        this.position = {
            x: GAME_WIDTH / 2 - this.scale.width / 2,
            y: 28
        }
        this.bullets = []
        this.bulletSpawnFrameCount = 0
        this.bulletSpawnDelay = 130
        this.spawnLaserDelay = 2000
        this.spawnLaserFrameCount = 0
        this.releaseLaserFrameCount = 0
        this.releaseLaserDelay = 850
        this.speed = {
            x: 0,
            y: 0
        }
        this.maxSpeed = {
            x: 1,
            y: 0
        }
        this.laser = {
            color: "red",
            position: {
                x: this.position.x + this.scale.width / 2 - 27,
                y: this.position.y + this.scale.height - 49
            },
            scale: {
                width: 60,
                height: 0
            }
        }
        this.lifebar = new Lifebar(0, 0, 5, 10, 500)
        this.speed.x = this.maxSpeed.x
    }
    createBullets() {
        const speed = 1.8
        const y =  this.position.y + this.scale.height - 25
        const w = 30
        const h = 27

        this.bullets.push(new Bullet(this.position.x + 43, y, 0, speed, w, h))
        this.bullets.push(new Bullet(this.position.x + 7, y, 0, speed, w, h))
        this.bullets.push(new Bullet(this.position.x + this.scale.width / 2 + 25, y, 0, speed, w, h))
        this.bullets.push(new Bullet(this.position.x + this.scale.width / 2 + 55, y, 0, speed, w, h))
    }
    spawnLaser() {
        this.laser.scale.height += .8
    }
    update() {
        this.position.x += this.speed.x
        if (this.bulletSpawnFrameCount === this.bulletSpawnDelay) {
            this.createBullets()
            this.bulletSpawnFrameCount = 0
        } else {
            this.bulletSpawnFrameCount++
        }
        if (this.position.x <= 0) this.speed.x = this.maxSpeed.x
        if (this.position.x + this.scale.width >= GAME_WIDTH) this.speed.x = -this.maxSpeed.x

        if (this.spawnLaserFrameCount === this.spawnLaserDelay) {
            if (this.laser.position.y + this.laser.scale.height >= GAME_HEIGHT) {
                if (this.releaseLaserDelay === this.releaseLaserFrameCount) {
                    this.laser.scale.height = 0
                    this.releaseLaserFrameCount = 0
                    this.spawnLaserFrameCount = 0
                } else {
                    this.releaseLaserFrameCount++
                }
            } else {
                this.spawnLaser()
            }
        } else {
            this.spawnLaserFrameCount++
        }

        this.laser.position.x = this.position.x + this.scale.width / 2 - 27
        this.laser.position.y = this.position.y + this.scale.height - 49

        this.bullets = this.bullets.filter(bullet => bullet.position.x + bullet.scale.width >= 0 && bullet.position.x <= GAME_WIDTH && bullet.position.y + bullet.scale.height >= 0 && bullet.position.y <= GAME_HEIGHT)

        this.bullets.forEach(bullet => {
            bullet.update()
        })

        this.lifebar.position.x = this.position.x + this.scale.width / 2 - this.lifebar.scale.width / 2
        this.lifebar.position.y = this.position.y - 12
        this.lifebar.update()
    }
}