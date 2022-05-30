export default class Lifebar {
    constructor(x, y, widthSegment, height, lives) {
        this.widthSegment = widthSegment
        this.position = { x, y }
        this.lives = lives
        this.scale = { width: this.widthSegment * this.lives, height }
    }
    update() {
        this.scale.width = this.widthSegment * this.lives
    }
    damage(life) {
        this.lives -= life
    }
}