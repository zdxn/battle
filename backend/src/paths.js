import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '..');
export const SRC_DIR = path.resolve(ROOT_DIR, 'src');
export const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
export const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

export const paths = {
  root: ROOT_DIR,
  src: SRC_DIR,
  dist: DIST_DIR,
  public: PUBLIC_DIR,
  models: path.resolve(SRC_DIR, 'models'),
  routes: path.resolve(SRC_DIR, 'routes'),
  services: path.resolve(SRC_DIR, 'services'),
  types: path.resolve(SRC_DIR, 'types'),
  utils: path.resolve(SRC_DIR, 'utils')
};
