import dotenv from 'dotenv';

dotenv.config();


const sequelizeConfig = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT as string, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export default sequelizeConfig;
