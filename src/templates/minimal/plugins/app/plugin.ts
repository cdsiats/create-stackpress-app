import { HttpServer } from 'stackpress';

export default function plugin(server: HttpServer) {
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/welcome.js'));
    server.view.get('/', '@/plugins/app/views/welcome');
  });
};