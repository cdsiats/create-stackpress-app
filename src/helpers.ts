import { cancel, isCancel } from '@clack/prompts';

export function isCancelled(value: string | symbol): void {
  if(isCancel(value)) {
    cancel('App creation cancelled.');
    process.exit(0);
  }
}