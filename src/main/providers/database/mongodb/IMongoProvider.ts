export default interface IMongoProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
