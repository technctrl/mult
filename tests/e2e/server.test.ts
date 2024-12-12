import { AppProvider } from '@main/providers/AppProvider';
import http from 'http';
import MongoProvider from '@main/providers/database/mongodb/MongoProvider';
import NodeMailerService from '@main/services/Notifications/mail/NodeMailerService';

// Mock des dépendances
jest.mock('@main/services/Notifications/mail/NodeMailerService');
jest.mock('@main/@types/Validator/AcessKey/AccessKey');

describe('AppProvider', () => {
  let mockLogger: any;
  let mockServerListen: jest.Mock;

  beforeEach(() => {
    process.env.PORT = '5000';
    mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    mockServerListen = jest.fn();

    // Mock de la méthode connect de MongoProvider
    jest.spyOn(MongoProvider.prototype, 'connect').mockResolvedValue(undefined);

    // Mock de NodeMailerService
    NodeMailerService.verifyTransport = jest.fn().mockResolvedValue(undefined);

    // Mock de la méthode listen de Express
    jest.spyOn(http, 'createServer').mockReturnValue({
      listen: mockServerListen,
    } as unknown as http.Server);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should initialize the application and start the server', async () => {
    await AppProvider(mockLogger, false)();

    // Vérifier que MongoDB est connecté
    expect(MongoProvider.prototype.connect).toHaveBeenCalledTimes(1);

    // Vérifier que NodeMailerService.verifyTransport() est appelé
    expect(NodeMailerService.verifyTransport).toHaveBeenCalledTimes(1);

    // Vérifier que le logger enregistre les informations correctes
    expect(mockLogger.info).toHaveBeenCalledWith('Database connected successfully');

    // Vérifier que le serveur écoute sur le bon port
    expect(mockServerListen).toHaveBeenCalledWith(process.env.PORT, expect.any(Function));
  });

  it('should not start the server in test mode', async () => {
    await AppProvider(mockLogger, true)();

    // Vérifier que le serveur n'est pas démarré en mode test
    expect(mockServerListen).not.toHaveBeenCalled();
  });

});
