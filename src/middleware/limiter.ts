
import rateLimit from 'express-rate-limit'

export default rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 600, // Limit each IP to 60 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})