import Boss from "./boss.js"
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js"
import Player from "./player.js"
import detectCollisionBetweenTwoObjects from "./collision.js"

export default class Game {
    constructor() {
        this.players = []
        this.boss = new Boss()
        this.objects = [this.players, this.boss]
    }
    createPlayer(id) {
        const player = new Player(this.players.length > 0 ? GAME_WIDTH / 2 + 70 : GAME_WIDTH / 2 - 70, GAME_HEIGHT - 100, id)
        this.players.push(player)
        return player
    }
    deletePlayer(id) {
        const index = this.players.findIndex(player => player.id === id)
        if (index === -1) return
        this.players.splice(index, 1)
    }
    update() {
        this.objects.forEach(object => {
            if (Array.isArray(object)) object.forEach(obj => {
                if (obj.update !== undefined) obj.update()
            })
            else if (object.update !== undefined) object.update()
        })

        this.players.forEach((player, playerIndex) => {
            player.bullets.forEach((bullet, bulletIndex) => {
                if (!this.boss) return
                if (detectCollisionBetweenTwoObjects(bullet.position.x, bullet.position.y, bullet.scale.width, bullet.scale.height, this.boss.position.x, this.boss.position.y, this.boss.scale.width, this.boss.scale.height)) {
                    player.bullets.splice(bulletIndex, 1)
                    this.boss.lifebar.damage(1)
                }
            })

            if (player.lifebar.lives < 1) this.players.splice(playerIndex, 1)

            if (!this.boss) return

            this.boss.bullets.forEach((bullet, bulletIndex) => {
                if (!this.boss) return
                if (detectCollisionBetweenTwoObjects(bullet.position.x, bullet.position.y, bullet.scale.width, bullet.scale.height, player.position.x, player.position.y, player.scale.width, player.scale.height)) {
                    this.boss.bullets.splice(bulletIndex, 1)
                    player.lifebar.damage(1)
                }
            })

            if (detectCollisionBetweenTwoObjects(this.boss.laser.position.x, this.boss.laser.position.y, this.boss.laser.scale.width, this.boss.laser.scale.height, player.position.x, player.position.y, player.scale.width, player.scale.height)) {
                player.lifebar.damage(1)
            }
            
            if (this.boss?.lifebar.lives < 1) delete this.boss
        })
    }
}