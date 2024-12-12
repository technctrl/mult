import 'reflect-metadata';
import { consoleLogger as ConsoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';
import { AppProvider } from '@main/providers/AppProvider';

import('tsconfig-paths')
  .then(({ register }) => {
    register({
      baseUrl: __dirname,
      paths: { '@/*': ['*'] },
      addMatchAll: false,
    });
  })
  .then(() => {
    AppProvider(ConsoleLogger)();
  });
