import fs from 'fs';
import path from 'path';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';

const loadModels = (sequelize: any): void => {
  const loadModelsFromDirectory = (dir: string) => {
    if (!fs.existsSync(dir)) {
      consoleLogger.error(`Le répertoire ${dir} n'existe pas.`);
      return;
    }

    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        loadModelsFromDirectory(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const model = require(fullPath);
          if (model.init) {
            model.init(sequelize);
          }
        } catch (err) {
          consoleLogger.error(`Erreur lors du chargement du modèle ${file} à partir de ${fullPath}:`, err);
        }
      }
    });
  };

  const baseDir = path.join(__dirname, '../../modules');

  if (!fs.existsSync(baseDir)) {
    consoleLogger.error(`Le répertoire de base ${baseDir} n'existe pas.`);
    return;
  }

  try {
    fs.readdirSync(baseDir).forEach((moduleDir) => {
      const modulePath = path.join(baseDir, moduleDir);
      const mysqlDir = path.join(modulePath, 'models');
      // console.log(`Recherche de modèles dans: ${mysqlDir}`);

      if (fs.existsSync(mysqlDir) && fs.lstatSync(mysqlDir).isDirectory()) {
        loadModelsFromDirectory(mysqlDir);
      } else {
        console.warn(`Le répertoire ${mysqlDir} n'existe pas ou n'est pas un répertoire.`);
      }
    });
  } catch (err) {
    consoleLogger.error(`Erreur lors de la lecture du répertoire ${baseDir}:`, err);
  }
};

export default loadModels;
