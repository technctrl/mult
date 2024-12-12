"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppProvider_1 = require("@main/providers/AppProvider");
const http_1 = __importDefault(require("http"));
const MongoProvider_1 = __importDefault(require("@main/providers/database/mongodb/MongoProvider"));
const NodeMailerService_1 = __importDefault(require("@main/services/Notifications/mail/NodeMailerService"));
jest.mock('@main/services/Notifications/mail/NodeMailerService');
jest.mock('@main/@types/Validator/AcessKey/AccessKey');
describe('AppProvider', () => {
    let mockLogger;
    let mockServerListen;
    beforeEach(() => {
        process.env.PORT = '5000';
        mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
        mockServerListen = jest.fn();
        jest.spyOn(MongoProvider_1.default.prototype, 'connect').mockResolvedValue(undefined);
        NodeMailerService_1.default.verifyTransport = jest.fn().mockResolvedValue(undefined);
        jest.spyOn(http_1.default, 'createServer').mockReturnValue({
            listen: mockServerListen,
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('should initialize the application and start the server', async () => {
        await (0, AppProvider_1.AppProvider)(mockLogger, false)();
        expect(MongoProvider_1.default.prototype.connect).toHaveBeenCalledTimes(1);
        expect(NodeMailerService_1.default.verifyTransport).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Database connected successfully');
        expect(mockServerListen).toHaveBeenCalledWith(process.env.PORT, expect.any(Function));
    });
    it('should not start the server in test mode', async () => {
        await (0, AppProvider_1.AppProvider)(mockLogger, true)();
        expect(mockServerListen).not.toHaveBeenCalled();
    });
});
