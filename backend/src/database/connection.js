import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: databaseConfig.logging,
    pool: databaseConfig.pool,
  }
);

export default sequelize;
