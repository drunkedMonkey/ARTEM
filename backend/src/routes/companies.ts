import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

export async function companyRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' }
    });
    
    return companies;
  });

  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        baremos: true,
        expeditions: true
      }
    });
    
    if (!company) {
      return reply.status(404).send({ error: 'Company not found' });
    }
    
    return company;
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Body: { name: string; logo?: string } }>, reply: FastifyReply) => {
    const { name, logo } = request.body;
    
    const company = await prisma.company.create({
      data: { name, logo }
    });
    
    return company;
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: { name?: string; logo?: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { name, logo } = request.body;
    
    const company = await prisma.company.update({
      where: { id },
      data: { name, logo }
    });
    
    return company;
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    await prisma.company.delete({
      where: { id }
    });
    
    return { success: true };
  });
}
