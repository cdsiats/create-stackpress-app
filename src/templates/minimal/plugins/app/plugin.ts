import { HttpServer } from 'stackpress';

export default function plugin(server: HttpServer) {
  server.on('listen', async _ => {
    //on error, show error page
    server.on('error', () => import('./pages/error.js'));
    //on response, check for errors
    server.on('response', async ({ req, res, ctx }) => {  
      if (res.error) {
        await ctx.emit('error', req, res);
      }
    });
  });
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/welcome.js'));
    server.view.get('/', '@/plugins/app/views/welcome');
  });
};