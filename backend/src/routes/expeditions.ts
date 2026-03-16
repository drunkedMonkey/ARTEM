import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const createExpeditionSchema = z.object({
  code: z.string(),
  companyId: z.string(),
  date: z.string().transform(val => new Date(val)),
  location: z.string(),
  description: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional()
});

const updateExpeditionSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING_BUDGET', 'COMPLETED', 'CANCELLED']).optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional()
});

export async function expeditionRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    
    const expeditions = await prisma.expedition.findMany({
      where: { userId: user.id },
      include: {
        company: true,
        photos: true,
        budgets: true,
        repairs: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return expeditions;
  });

  fastify.get('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    
    const expedition = await prisma.expedition.findFirst({
      where: { id, userId: user.id },
      include: {
        company: true,
        photos: true,
        budgets: true,
        repairs: true
      }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    return expedition;
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const body = createExpeditionSchema.parse(request.body);
    
    const expedition = await prisma.expedition.create({
      data: {
        ...body,
        userId: user.id
      },
      include: {
        company: true
      }
    });
    
    return expedition;
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    const body = updateExpeditionSchema.parse(request.body);
    
    const expedition = await prisma.expedition.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    const updated = await prisma.expedition.update({
      where: { id },
      data: body,
      include: {
        company: true
      }
    });
    
    return updated;
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    
    const expedition = await prisma.expedition.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    await prisma.expedition.delete({
      where: { id }
    });
    
    return { success: true };
  });

  // Photos
  fastify.post('/:id/photos', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: { path: string; caption?: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    const { path, caption } = request.body;
    
    const expedition = await prisma.expedition.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    const photo = await prisma.photo.create({
      data: {
        expeditionId: id,
        path,
        caption
      }
    });
    
    return photo;
  });

  // Budgets
  fastify.post('/:id/budgets', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: { path: string; amount?: number; description?: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    const { path, amount, description } = request.body;
    
    const expedition = await prisma.expedition.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    const budget = await prisma.budget.create({
      data: {
        expeditionId: id,
        path,
        amount,
        description
      }
    });
    
    return budget;
  });
}
