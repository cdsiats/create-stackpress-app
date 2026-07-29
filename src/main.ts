import { intro, outro, select, text } from '@clack/prompts';
import pc from 'picocolors';
import { isCancelled } from './helpers.js';

async function main() {
  intro(pc.inverse('Create Stackpress App'));

  const appName = await text({
    message: 'What is the name of your application?',
    placeholder: 'Some cool app name',
    validate(name) {
      if (!name) return 'App name is required.';
    }
  });

  isCancelled(appName);

  const projectType = await select({
    message: 'What kind of project are you building?',
    options: [
      {
        value: 'example',
        label: 'Example App'
      },
      {
        value: 'minimal',
        label: 'Minimal App'
      },
      {
        value: 'full',
        label: 'Full Stack'
      }
    ]
  });

  isCancelled(projectType);

  outro(`${String(appName)} has been created. You're all set!`);
};

main().catch((err: Error) => {
  console.error(err.message); 
  process.exit(0);
});