import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.js';
import { expeditionRoutes } from './routes/expeditions.js';
import { companyRoutes } from './routes/companies.js';
import { baremRoutes } from './routes/baremos.js';
import { repairRoutes } from './routes/repairs.js';
import { assistantRoutes } from './routes/assistant.js';

const server = Fastify({
  logger: true
});

await server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
});

await server.register(cookie);

await server.register(jwt, {
  secret: process.env.JWT_SECRET || 'artem-super-secret-key-change-in-production',
  cookie: {
    cookieName: 'token',
    signed: false
  }
});

server.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await server.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false
});

server.get('/health', async () => ({ status: 'ok' }));

await server.register(authRoutes, { prefix: '/api/auth' });
await server.register(expeditionRoutes, { prefix: '/api/expeditions' });
await server.register(companyRoutes, { prefix: '/api/companies' });
await server.register(baremRoutes, { prefix: '/api/baremos' });
await server.register(repairRoutes, { prefix: '/api/repairs' });
await server.register(assistantRoutes, { prefix: '/api/assistant' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
