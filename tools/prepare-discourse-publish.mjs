import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const packagesDir = new URL('../packages/', import.meta.url);
const packageNames = await readdir(packagesDir);

for (const packageName of packageNames.sort()) {
  const packageJsonPath = join(packagesDir.pathname, packageName, 'dist', 'package.json');
  let packageJson;

  try {
    packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  packageJson.name = `@discourse/${packageName}`;
  packageJson.repository = 'github:discourse/jSquash';
  packageJson.publishConfig = {
    access: 'public',
  };

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`${packageJson.name}@${packageJson.version}`);
}
