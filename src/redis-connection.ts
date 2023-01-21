/* eslint-disable no-use-before-define */
import redis from 'ioredis';

export default class RedisClient {
  private static instance: RedisClient;

  public Client: redis.Redis | null = null;

  /* 
    eslint-disable-next-line no-useless-constructor, 
    @typescript-eslint/no-empty-function
  */
  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  async connect() {
    this.Client = redis.Redis.createClient();

    this.Client.on('error', (error) => {
      console.error(`Error Redis: ${error}`);
    });

    return this.Client;
  }

  disconnect() {
    if (this.Client) {
      this.Client.disconnect();
    }
  }
}
