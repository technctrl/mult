import mongoose from 'mongoose';
import IMongoProvider from './IMongoProvider';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';

export default class MongoProvider implements IMongoProvider {
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      consoleLogger.log('Connected successfully to MongoDB with Mongoose');
    } catch (error) {
      // consoleLogger.error('Error connecting to MongoDB with Mongoose:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      consoleLogger.log('MongoDB disconnected');
    } catch (error) {
      consoleLogger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}
