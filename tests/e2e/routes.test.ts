import fs from 'fs';
import { config } from '@main/providers/LocalsProvider';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';
import ErrorHandlerProvider from '@main/providers/ErrorHandlerProvider';
import { RoutesHandler } from '@/main';

// Mocks pour les dépendances externes
jest.mock('fs');
jest.mock('@main/providers/LocalsProvider');
jest.mock('@main/@types/Logger/infrastructure/ConsoleLogger');
jest.mock('@main/providers/ErrorHandlerProvider');

// Simuler l'importation de modules de routes
const mockModuleRoutes = { default: jest.fn() };

describe('RoutesHandler', () => {
  let app: any;

  beforeEach(() => {
    // Initialiser un mock de l'application Express
    app = {
      use: jest.fn(),
      _router: {
        stack: [],
      },
    };

    // Simuler une configuration d'API
    (config as jest.Mock).mockReturnValue({
      api_prefix: '/api',
    });

    // Simuler l'existence des fichiers de route
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Simuler la lecture des répertoires
    (fs.readdirSync as jest.Mock).mockReturnValue(['auth']);

    // Simuler l'importation dynamique des fichiers de routes
    jest.mock('@/modules/auth/infra/routes/auth.routes.ts', () => ({
      default: mockModuleRoutes,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Nettoyer les mocks après chaque test
  });

  it('devrait charger les routes correctement pour un module avec fichier .ts', () => {
    // Exécuter la méthode setupRoutes
    RoutesHandler.setupRoutes(app);

    // Vérifier que app.use a été appelé avec le bon préfixe et les bonnes routes
    expect(app.use).toHaveBeenCalledWith('/api/auth', mockModuleRoutes);
  });

  it('devrait loguer une erreur lorsque le fichier de routes n\'existe pas', () => {
    // Simuler l'absence de fichiers de routes
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(false);
    (fs.readdirSync as jest.Mock).mockReturnValue(['auth']);

    // Vérifier que l'erreur est loguée
    const consoleSpy = jest.spyOn(consoleLogger, 'error');
    RoutesHandler.setupRoutes(app);
    expect(consoleSpy).toHaveBeenCalledWith('Le fichier de routes n\'existe pas pour le module : auth');
  });

  it('devrait appeler ErrorHandlerProvider.notFoundHandler avec les informations de route collectées', () => {
    // Simuler l'existence des fichiers de route et le chargement des modules
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(false);
    (fs.readdirSync as jest.Mock).mockReturnValue(['auth']);

    // Appeler setupRoutes
    RoutesHandler.setupRoutes(app);

    // Vérifier que ErrorHandlerProvider.notFoundHandler a bien été appelé
    expect(app.use).toHaveBeenCalledWith(ErrorHandlerProvider.notFoundHandler(expect.anything()));
  });
});
