export default interface IMySQLProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
