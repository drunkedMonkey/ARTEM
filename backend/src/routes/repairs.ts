import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const createRepairSchema = z.object({
  expeditionId: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  specialty: z.string().optional()
});

export async function repairRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    
    const repairs = await prisma.repair.findMany({
      where: { userId: user.id },
      include: {
        expedition: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return repairs;
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const body = createRepairSchema.parse(request.body);
    
    const expedition = await prisma.expedition.findFirst({
      where: { id: body.expeditionId, userId: user.id }
    });
    
    if (!expedition) {
      return reply.status(404).send({ error: 'Expedition not found' });
    }
    
    const repair = await prisma.repair.create({
      data: {
        ...body,
        userId: user.id
      },
      include: {
        expedition: true
      }
    });
    
    return repair;
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    const body = createRepairSchema.partial().parse(request.body);
    
    const repair = await prisma.repair.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!repair) {
      return reply.status(404).send({ error: 'Repair not found' });
    }
    
    const updated = await prisma.repair.update({
      where: { id },
      data: body,
      include: {
        expedition: true
      }
    });
    
    return updated;
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { id } = request.params;
    
    const repair = await prisma.repair.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!repair) {
      return reply.status(404).send({ error: 'Repair not found' });
    }
    
    await prisma.repair.delete({
      where: { id }
    });
    
    return { success: true };
  });
}
