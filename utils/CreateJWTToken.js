import jwt from 'jsonwebtoken'
import authConfig from '~~/config/auth'

export default ({ user, config = authConfig }) => {
    let jwtUser = {
        _id: user._id,
        email: user.email
    }

    let token = jwt.sign(
        { user: jwtUser },
        config.secret,
        { expiresIn: config.tokenLifeTime }
    )

    return token
}