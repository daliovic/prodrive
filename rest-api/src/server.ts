process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';
import 'dotenv/config';

import App from '@/app';
import AccountRoute from '@routes/accounts.route';
import AuthRoute from '@routes/auth.route';
import ChaptersRoute from '@routes/chapters.route';
import DriversRoute from '@routes/drivers.route';
import IndexRoute from '@routes/index.route';
import QuestionsRoute from '@routes/questions.route';
import TransportersRoute from '@routes/transporters.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const routes = [
  new IndexRoute(),
  new QuestionsRoute(),
  new TransportersRoute(),
  new DriversRoute(),
  new ChaptersRoute(),
  new AuthRoute(),
  new AccountRoute(),
];

const app = new App(routes);

app.listen();
