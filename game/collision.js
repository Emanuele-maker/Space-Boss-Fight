const detectCollisionBetweenTwoObjects = (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) => {
    return r1x + r1w >= r2x && r1x <= r2x + r2w && r1y + r1h >= r2y && r1y <= r2y + r2h
}

export default detectCollisionBetweenTwoObjects