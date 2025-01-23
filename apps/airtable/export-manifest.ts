import dotenv from 'dotenv';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import path from 'path';

dotenv.config();

(async () => {
  const appName = process.argv[2];

  const manifestGenerator = (
    await import(`./src/app-manifests/${appName}.manifest.ts`)
  ).default;

  const manifestDir = path.join(__dirname, '.manifest-out');
  if (!existsSync(manifestDir)) {
    mkdirSync(manifestDir);
  }

  writeFileSync(
    path.join(manifestDir, `${appName}.manifest.json`),
    JSON.stringify(manifestGenerator(), null, 2),
  );
})();
