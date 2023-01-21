import RedisClient from './redis-connection.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet-handler.js';
import DatabaseHandler from './database-handler.js';

const redisClient = RedisClient.getInstance();

const databaseHandler = new DatabaseHandler();

async function bootstrap() {
  await databaseHandler.run();

  redisClient.disconnect();
}

bootstrap();
