//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { 
  existsSync,
} from 'node:fs';
import { cp, mkdir, readFile, rename, writeFile, copyFile } from 'node:fs/promises';
//modules
import { cancel, isCancel } from '@clack/prompts';
import type { CopyTemplateOptions, ReplaceTemplateValues } from './types.js';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function isCancelled(value: unknown): void {
  if(isCancel(value)) {
    cancel('App creation cancelled.');
    process.exit(0);
  }
};

export async function copyTemplate(options: CopyTemplateOptions) {
  const templateDirectory = path.join(
    __dirname, 
    'templates', 
    options.templateName
  );
  const targetDirectory = path.resolve(options.targetDirectory);
  const existingIdea = path.join(targetDirectory, 'schema.idea');
  const shouldKeepIdea = existsSync(existingIdea);

  if (!existsSync(templateDirectory)) {
    throw new Error(`Templates ${options.templateName} does not exist.`);
  }

  await mkdir(targetDirectory, { recursive: true });

  await cp(templateDirectory, targetDirectory, {
    recursive: true,
    filter(source) {
      const relativePath = path.relative(templateDirectory, source);

      if (shouldKeepIdea && relativePath === 'schema.idea') {
        return false;
      }

      return true;
    }
  });

  const templateGitIgnore = path.join(targetDirectory, '_gitignore');
  const targetGitIgnore = path.join(targetDirectory, '.gitignore');
  
  if (existsSync(templateGitIgnore)) {
    await rename(templateGitIgnore, targetGitIgnore);
  }

  await replaceTemplateValues(targetDirectory, {
    projectName: options.projectName,
    brandName: options.brandName
  });
};

async function replaceTemplateValues(
  targetDirectory: string, 
  values: ReplaceTemplateValues
) {
  const filesToReplace = [
    'package.json',
    'config/common.ts'
  ];

  for (const file of filesToReplace) {
    const filePath = path.join(targetDirectory, file);

    if (!existsSync(filePath)) {
      continue;
    }

    const contents = await readFile(filePath, 'utf8')
    const updatedPlaceholders = contents
      .replaceAll('_PROJECT__NAME_', values.projectName)
      .replaceAll('_BRAND__NAME_', values.brandName);

    await writeFile(filePath, updatedPlaceholders);
  };
};

export async function copyEnvFile(targetDirectory: string) {
  await copyFile(
    path.join(targetDirectory, '.env.example'),
    path.join(targetDirectory, '.env')
  );
};

export function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'ignore',
      shell: process.platform === 'win32'
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed.`));
    });
  });
}