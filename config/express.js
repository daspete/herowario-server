import 'dotenv/config'

export default {
    ip: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || '3000',
    logFormat: process.env.LOG_FORMAT || '[:date] :method :url :status :res[content-length] - :response-time ms / :remote-addr ":referrer" ":user-agent"',
    prefix: process.env.PREFIX || '/api',
}
