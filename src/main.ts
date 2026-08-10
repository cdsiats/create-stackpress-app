#!/usr/bin/env node

//node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import { 
  confirm, 
  intro, 
  outro, 
  select, 
  spinner, 
  text 
} from '@clack/prompts';
import pc from 'picocolors';
//local
import { copyTemplate, isCancelled, runCommand } from './helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logo = readFileSync(path.join(__dirname, 'logo.txt'), 'utf-8');

async function main() {
  console.clear();
  console.log(logo);
  console.log(' ');
  intro(pc.inverse(' Create Stackpress App '));

  const directory = await text({
    message: `Enter project directory`,    
    placeholder: 'Press enter to install in current directory',
    defaultValue: './'
  });
  isCancelled(directory);

  const targetDirectory = String(directory || './');
  const defaultProjectName = path.basename(path.resolve(targetDirectory));

  const projectName = await text({
    message: 'Enter project name',
    placeholder: 'Press enter if the same as directory name',
    defaultValue: defaultProjectName
  });
  isCancelled(projectName);

  const brandName = await text({
    message: 'Enter a brand name',
    placeholder: 'Press enter if the same as directory name',
    defaultValue: defaultProjectName
  });
  isCancelled(brandName);

  const database = await select({
    message: 'Select a database',
    options: [
      {
        label: 'PGlite',
        value: 'pglite'
      },
      {
        label: 'MySQL',
        value: 'mysql',
        hint: 'Coming Soon',
        disabled: true
      },
      {
        label: 'Postgres',
        value: 'postgres',
        hint: 'Coming Soon',
        disabled: true
      }
    ],
    initialValue: 'pglite'
  });
  isCancelled(database);

  const shouldInstallDeps = await confirm({
    message: 'Install dependencies?',
    initialValue: true
  });
  isCancelled(shouldInstallDeps);

  const shouldInitGit = await confirm({
    message: 'Initialize git repository?',
    initialValue: true
  });
  isCancelled(shouldInitGit);

  let shouldGenerateIdeas: boolean | symbol = false;
  let shouldMigrateAndDeploy: boolean | symbol = false;
  if (Boolean(shouldInstallDeps)) {
    shouldGenerateIdeas = await confirm({
      message: 'Run `stackpress generate`?',
      initialValue: true
    });
    isCancelled(shouldGenerateIdeas);
  
    shouldMigrateAndDeploy = await confirm({
      message: 'Generate migrations and deploy?',
      initialValue: true
    });
    isCancelled(shouldMigrateAndDeploy);
  }

  await copyTemplate({
    templateName: 'minimal',
    targetDirectory,
    projectName: String(projectName),
    brandName: String(brandName).toUpperCase()
  });

  const installedProjectDirectory = path.resolve(String(directory));

  const spin = spinner();
  if (Boolean(shouldInstallDeps)) {
    spin.start('Installing dependencies...');
    await runCommand('npm', ['install'], installedProjectDirectory);
    spin.stop('Dependencies installed.');
  }

  if (Boolean(shouldInitGit)) {
    spin.start('Initializing git...');
    await runCommand('git', ['init'], installedProjectDirectory);
    await runCommand('git', ['add', '.'], installedProjectDirectory);
    await runCommand('git', ['commit', '-m', 'Initial commit'], installedProjectDirectory);
    spin.stop('Initialized git repository.');
  }

  if (Boolean(shouldGenerateIdeas)) {
    spin.start('Generating ideas...');
    await runCommand('npm', ['run', 'generate'], installedProjectDirectory);
    spin.stop('Generated Ideas.');
  }

  if (Boolean(shouldMigrateAndDeploy)) {
    spin.start('Generating migrations...');
    await runCommand('npm', ['run', 'migrate'], installedProjectDirectory);
    spin.stop('Generated migrations.');
    spin.start('Applying to database...');
    await runCommand('npm', ['run', 'push'], installedProjectDirectory);
    spin.stop('Applied to database.');
  }
  //copy .env.example into .env
  await runCommand('cp', ['.env.example', '.env'], installedProjectDirectory);

  outro(`${String(projectName)} has been created. Welcome to stackpress!`);
};

main().catch((err: Error) => {
  console.error(err.message); 
  process.exit(0);
});