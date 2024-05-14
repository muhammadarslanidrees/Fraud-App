import redis from 'express-redis-cache'

const redisCache = redis({
    port: 6379,
    host: 'localhost',
    expire: 60 * 60,
    prefix: 'master_backend'
})

export default redisCache;