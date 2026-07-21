import sequelize from './connection.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDatabase = async ({
  maxRetries = 10,
  baseDelayMs = 2000,
  maxDelayMs = 30000,
} = {}) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Unable to connect to the database after ${maxRetries} attempts:`, error);
        throw error;
      }

      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      console.warn(
        `Database connection attempt ${attempt}/${maxRetries} failed. Retrying in ${delay}ms...`
      );
      await sleep(delay);
    }
  }
};

export const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export default sequelize;
