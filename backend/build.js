import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  config: path.join(__dirname, '.sequelizerc'),
  'models-path': path.join(__dirname, 'src/models'),
  'seeders-path': path.join(__dirname, 'src/seeders'),
  'migrations-path': path.join(__dirname, 'src/migrations'),
};
