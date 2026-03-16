import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });
    
    if (existingUser) {
      return reply.status(400).send({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return { user, token };
  });

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body);
    
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });
    
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(body.password, user.password);
    
    if (!validPassword) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  });

  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('token', { path: '/' });
    return { success: true };
  });

  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!foundUser) {
      return reply.status(404).send({ error: 'User not found' });
    }
    
    return foundUser;
  });
}
