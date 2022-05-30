export default class Bullet {
    constructor(x, y, angle, maxSpeed, width, height) {
        this.position = { x, y }
        this.angle = angle
        this.speed = {
            x: 0,
            y: maxSpeed
        }
        this.scale = { width, height }
    }
    update() {
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}