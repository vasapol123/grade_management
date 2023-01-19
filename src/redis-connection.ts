import redis from 'redis';

const redisClient = redis.createClient();

redisClient.on('error', (error) => console.error(`Error Redis: ${error}`));

await redisClient.connect();

export default redisClient;
