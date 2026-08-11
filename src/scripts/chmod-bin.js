//node
import { chmod } from 'node:fs/promises';

await chmod('dist/main.js', 0o755);
