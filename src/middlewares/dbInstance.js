import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'mssql',
  host: process.env.DB_HOST,
  dialectOptions: {
    instanceName: 'WTINSTANCE',
    options: {
      useUTC: false,
      dateFirst: 1
    }
  },
  logging: false
})

export default sequelize