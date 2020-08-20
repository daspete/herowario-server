import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'

export default (config) => {
    passport.use(new JWTStrategy({
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (token, done) => {
        try{
            return done(null, token.user)
        }catch(err){
            return done(err)
        }
    }))

    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })
}
