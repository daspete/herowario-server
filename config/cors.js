import 'dotenv/config'

export default {
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: process.env.CORS_OPTIONS_SUCCESS_STATUS || 200,
}
