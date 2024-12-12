import * as path from 'path';
import * as dotenv from 'dotenv';
import { Application } from 'express';

const config = () => {
  dotenv.config({ path: path.join(__dirname, '../../../.env') });

  const port = process.env.PORT || 5000;
  const appname = process.env.APP_NAME || '';
  const node_env = process.env.NODE_ENV || 'dev';
  const appSecret = process.env.APP_SECRET || `gqKit1-EDopfHmZgPqqzO7SlXGStvJe1eSjDB2Zcx6w`;
  const api_prefix = process.env.API_PREFIX || '/api';

  const username = 'admin';
  const password = 'password';

  return {
    port,
    appname,
    node_env,
    appSecret,
    api_prefix,
    username,
    password,
  };
};

const init = (_express: Application) => {
  _express.locals.app = config();
  _express.get('/', (req, res) => {
    res.send(`<h1>${config().appname} API server</h1> <br>`);
  });
  return _express;
};

export { config, init };
