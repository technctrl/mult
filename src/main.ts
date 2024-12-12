import fs from 'fs';
import path from 'path';
import { config } from '@main/providers/LocalsProvider';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';
import { RouteInfoImp } from '@main/@types/RouteInfoImp';
import ErrorHandlerProvider from '@main/providers/ErrorHandlerProvider';

export class RoutesHandler {

  private static info: RouteInfoImp[] = [];

  public static setupRoutes(app: any) {

    const modules = fs.readdirSync(path.join(__dirname, 'modules'));

    modules.forEach((name) => {
      try {
        const routerPathTs = path.join(
          __dirname,
          'modules',
          name,
          'infra',
          'routes',
          `${name}.routes.ts`
        );
        const routerPathJs = path.join(
          __dirname,
          'modules',
          name,
          'infra',
          'routes',
          `${name}.routes.js`
        );

        const routerPath = fs.existsSync(routerPathTs) ? routerPathTs : (fs.existsSync(routerPathJs) ? routerPathJs : null);

        if (routerPath) {
          const moduleRoutes = require(routerPath).default;
          if (moduleRoutes) {
            app.use(`${config().api_prefix}/${name}`, moduleRoutes);

            app._router.stack.forEach((layer: any) => {
              if (layer.handle && layer.handle.stack) {
                layer.handle.stack.forEach((routeLayer: any) => {
                  if (routeLayer.route) {
                    const methods = Object.keys(routeLayer.route.methods);
                    const path = routeLayer.route.path;

                    const lastHandler = routeLayer.route.stack[routeLayer.route.stack.length - 1].handle.name;

                    methods.forEach((method) => {
                      this.info.push({ method, path: `${config().api_prefix}/${name}${path}`, handler: lastHandler });
                    });
                  }
                });
              }
            });
          }
        } else {
          consoleLogger.error(`Le fichier de routes n'existe pas pour le module : ${name}`);
        }
      } catch (error) {
        consoleLogger.error(`Erreur lors du chargement des routes pour le module : ${name}`, error);
      }
    });

    app.use(ErrorHandlerProvider.notFoundHandler(this.info as [RouteInfoImp]));
  }
}
