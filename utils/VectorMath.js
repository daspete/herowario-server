export default {
    AngleBetweenVectors(p1, p2){
        return this.RadiansToAngle(this.RadiansBetweenVectors(p1, p2))
    },

    RadiansBetweenVectors(p1, p2){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x)
    },

    AngleToRadians(angle){
        return angle * (Math.PI / 180)
    },

    RadiansToAngle(radians){
        return radians * 180 / Math.PI
    },

    VectorFromOriginRadiusAngle(origin, radius, angle){
        let x = Math.round(origin.x + radius * Math.cos(this.AngleToRadians(angle)))
        let y = Math.round(origin.y + radius * Math.sin(this.AngleToRadians(angle)))

        return { x, y }
    }
}