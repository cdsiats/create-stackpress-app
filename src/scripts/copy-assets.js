//node
import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

await cp('src/templates', 'dist/templates', {
  recursive: true
});

await cp('src/logo.txt', 'dist/logo.txt');