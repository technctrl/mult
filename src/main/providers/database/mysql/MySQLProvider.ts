import { Sequelize } from "sequelize";
import IMySQLProvider from "@main/providers/database/mysql/IMySQLProvider";
import loadModels from '@main/helpers/loadModel';

class MySQLProvider implements IMySQLProvider {
  private sequelize: Sequelize;

  constructor(config: any) {

    this.sequelize = new Sequelize(
          config.database,
          config.username,
          config.password,
            {
              dialect: config.dialect,
              host: config.host,
            }
      );
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Load all models
      loadModels(this.sequelize);

      // Sync all models
      await this.sequelize.sync();
    } catch (error) {
        // consoleLogger.error('Unable to connect to the database:', error)
      throw error
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      console.log('Connection has been closed successfully.');
    } catch (error) {
      console.error('Unable to close the database connection:', error);
    }
  }
}

export default MySQLProvider;
