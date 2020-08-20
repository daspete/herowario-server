import 'dotenv/config'

export default {
    secret: process.env.AUTH_SECRET || 'this-is-a-very-secure-string-which-protects-the-jwt-token-from-being-injected-with-wrong-data',
    tokenLifeTime: parseInt(process.env.AUTH_TOKEN_LIFETIME) || (60 * 60 * 24 * 7),
    usernameField: process.env.AUTH_USERNAME_FIELD || 'email',
    passwordField: process.env.AUTH_PASSWORD_FIELD || 'password',
}