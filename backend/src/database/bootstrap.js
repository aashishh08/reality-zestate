import sequelize from './connection.js';

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
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
