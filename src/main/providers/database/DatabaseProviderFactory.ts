import MongoProvider from "@main/providers/database/mongodb/MongoProvider";
import MySQLProvider from "@main/providers/database/mysql/MySQLProvider";
import sequelizeConfig from "@main/providers/database/mysql/sequelize";

const createDatabaseProvider = (): any => {

  const dbType : string = process.env.DB_TYPE?.toLowerCase() || "mongodb";

  switch (dbType) {
    case 'mongodb':
      return new MongoProvider(process.env.MONGO_URI || '');
    case 'mysql':
      return new MySQLProvider(sequelizeConfig);
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}

export default createDatabaseProvider;
