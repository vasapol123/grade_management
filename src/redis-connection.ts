import redis from 'redis';

const redisClient = redis.createClient();

redisClient.on('error', (error) => console.error(`Error Redis: ${error}`));

await redisClient.connect();

const disconnect = async (): Promise<void> => {
  await redisClient.disconnect();
};

export default redisClient;
export { disconnect };
