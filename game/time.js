const startTimer = (duration, onFinish) => {
    var start = Date.now(),
        diff,
        minutes,
        seconds,
        finished = false
    const timer = () => {
        if (finished) return
        diff = duration - (((Date.now() - start) / 1000) | 0)

        minutes = (diff / 60) | 0
        seconds = (diff % 60) | 0

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        if (diff <= 0) {
            start = Date.now() + 1000
        }

        if (seconds === "00" && minutes === "00") {
            finished = true
            return onFinish()
        }
    }

    timer()
    setInterval(timer, 1000)
    if (finished) return clearInterval(timer)
}

export default startTimer