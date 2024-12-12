"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const LocalsProvider_1 = require("@main/providers/LocalsProvider");
const ConsoleLogger_1 = require("@main/@types/Logger/infrastructure/ConsoleLogger");
const ErrorHandlerProvider_1 = __importDefault(require("@main/providers/ErrorHandlerProvider"));
const main_1 = require("@/main");
jest.mock('fs');
jest.mock('@main/providers/LocalsProvider');
jest.mock('@main/@types/Logger/infrastructure/ConsoleLogger');
jest.mock('@main/providers/ErrorHandlerProvider');
const mockModuleRoutes = { default: jest.fn() };
describe('RoutesHandler', () => {
    let app;
    beforeEach(() => {
        app = {
            use: jest.fn(),
            _router: {
                stack: [],
            },
        };
        LocalsProvider_1.config.mockReturnValue({
            api_prefix: '/api',
        });
        fs_1.default.existsSync.mockReturnValue(true);
        fs_1.default.readdirSync.mockReturnValue(['auth']);
        jest.mock('@/modules/auth/infra/routes/auth.routes.ts', () => ({
            default: mockModuleRoutes,
        }));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('devrait charger les routes correctement pour un module avec fichier .ts', () => {
        main_1.RoutesHandler.setupRoutes(app);
        expect(app.use).toHaveBeenCalledWith('/api/auth', mockModuleRoutes);
    });
    it('devrait loguer une erreur lorsque le fichier de routes n\'existe pas', () => {
        fs_1.default.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
        fs_1.default.readdirSync.mockReturnValue(['auth']);
        const consoleSpy = jest.spyOn(ConsoleLogger_1.consoleLogger, 'error');
        main_1.RoutesHandler.setupRoutes(app);
        expect(consoleSpy).toHaveBeenCalledWith('Le fichier de routes n\'existe pas pour le module : auth');
    });
    it('devrait appeler ErrorHandlerProvider.notFoundHandler avec les informations de route collectées', () => {
        fs_1.default.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
        fs_1.default.readdirSync.mockReturnValue(['auth']);
        main_1.RoutesHandler.setupRoutes(app);
        expect(app.use).toHaveBeenCalledWith(ErrorHandlerProvider_1.default.notFoundHandler(expect.anything()));
    });
});
