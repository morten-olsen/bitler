import { Container } from '@bitlerjs/core';
import { program } from 'commander';

program.command('start').action(async () => {
  await import('./server/server.js');
});

const auth = program.command('auth');

auth.command('generate-token').action(async () => {
  const { AuthService } = await import('./auth/auth.service.js');
  const container = new Container();
  const authService = container.get(AuthService);
  const token = await authService.generateToken({});
  console.log(`Token: ${token}`);
});

await program.parseAsync(process.argv);
