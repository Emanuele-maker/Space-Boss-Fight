class InputManager {
    constructor() {
        this.gamepadLeftJoystick = {
            x: 0,
            y: 0
        }
        this.pressedGamepadButtons = []
        this.mousePosition = {
            x: 0,
            y: 0
        }
        this.mouseButtonsPressed = []
        this.keysPressed = []

        window.addEventListener("gamepadconnected", () => {
            const update = () => {
                const gamepad = navigator.getGamepads()[0]
                if (!gamepad) return
                for (const [index, axis] of gamepad.axes.entries()) {
                    if (index === 0) this.gamepadLeftJoystick.x = axis
                    if (index === 1) this.gamepadLeftJoystick.y = axis
                }
                this.pressedGamepadButtons = Array.from(gamepad.buttons)
                requestAnimationFrame(update)
            }
            update()
        })

        window.addEventListener("mousedown", (event) => {
            this.mousePosition = {
                x: event.offestX,
                y: event.offsetY
            }
            if (!this.mouseButtonsPressed.includes(event.button)) this.mouseButtonsPressed.push(event.button)
        })

        window.addEventListener("mousemove", (event) => {
            this.mousePosition = {
                x: event.offsetX,
                y: event.offsetY
            }
        })

        window.addEventListener("mouseup", (event) => {
            const index = this.mouseButtonsPressed.indexOf(event.button)
            if (index === -1) return
            this.mouseButtonsPressed.splice(index, 1)
        })

        window.addEventListener("keydown", (event) => {
            if (!this.keysPressed.includes(event.keyCode)) this.keysPressed.push(event.keyCode)
        })

        window.addEventListener("keyup", (event) => {
            const index = this.keysPressed.indexOf(event.keyCode)
            if (index === -1) return
            this.keysPressed.splice(index, 1)
        })
    }
    isMouseButtonPressed(button) {
        return this.mouseButtonsPressed.includes(button)
    }
    isGamepadButtonPressed(button) {
        return this.pressedGamepadButtons.find(btn => btn.value === button) !== undefined
    }
    isKeyPressed(key) {
        return this.keysPressed.includes(key)
    }
    get mouseX() {
        return this.mousePosition.x
    }
    get mouseY() {
        return this.mousePosition.y
    }
}

const input = new InputManager()

export default input