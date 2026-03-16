import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { uploadBaremPdf, deleteBaremPdf } from '../lib/supabase.js';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBaremSchema = z.object({
  companyId: z.string(),
  name: z.string(),
  sector: z.string(),
  description: z.string().optional(),
  amount: z.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  fileBase64: z.string().optional(),
  fileName: z.string().optional()
});

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const { extractTextFromPdf: extract } = await import('../../pdfExtractor.cjs');
    const text = await extract(filePath);
    return text || '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

async function summarizeWithAI(text: string): Promise<string> {
  if (!GROQ_API_KEY || !text) return text;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un asistente que resume documentos de tarifas de seguros (baremos). Extrae la información más importante: precios, conceptos, categorías de servicios. Sé muy conciso y estructurado. Si no hay información útil, responde "No se pudo extraer información útil del documento."' 
          },
          { role: 'user', content: text.substring(0, 8000) }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content || text;
    }
  } catch (error) {
    console.error('AI extraction error:', error);
  }
  return text;
}

export async function baremRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    const { companyId, search, sector } = request.query as { companyId?: string; search?: string; sector?: string };
    
    const where: any = {};
    
    if (companyId) {
      where.companyId = companyId;
    }
    
    if (sector) {
      where.sector = sector;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { extractedText: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const baremos = await prisma.barem.findMany({
      where,
      include: {
        company: true
      },
      orderBy: [
        { sector: 'asc' },
        { name: 'asc' }
      ]
    });
    
    return baremos;
  });

  fastify.get('/sectors', async (request: FastifyRequest, reply: FastifyReply) => {
    const sectors = await prisma.barem.findMany({
      select: { sector: true },
      distinct: ['sector']
    });
    return sectors.map(s => s.sector);
  });

  fastify.get('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    const barem = await prisma.barem.findUnique({
      where: { id },
      include: {
        company: true
      }
    });
    
    if (!barem) {
      return reply.status(404).send({ error: 'Barem not found' });
    }
    
    return barem;
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string };
    
    const body = createBaremSchema.parse(request.body);

    let filePath = '';
    let extractedText = '';
    
    if (body.fileBase64 && body.fileName) {
      const buffer = Buffer.from(body.fileBase64, 'base64');
      const result = await uploadBaremPdf(user.id, buffer, body.fileName);
      filePath = result.url;
      
      // Save RAW extracted text (without AI summarization) to preserve codes and details
      if (result.localPath && body.fileName.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(result.localPath);
      }
    }
    
    const barem = await prisma.barem.create({
      data: {
        companyId: body.companyId,
        name: body.name,
        sector: body.sector,
        description: body.description,
        amount: body.amount,
        unit: body.unit,
        notes: body.notes,
        filePath: filePath || null,
        extractedText: extractedText || null
      },
      include: {
        company: true
      }
    });
    
    return barem;
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const body = createBaremSchema.partial().parse(request.body);
    
    const barem = await prisma.barem.update({
      where: { id },
      data: {
        companyId: body.companyId,
        name: body.name,
        sector: body.sector,
        description: body.description,
        amount: body.amount,
        unit: body.unit,
        notes: body.notes
      },
      include: {
        company: true
      }
    });
    
    return barem;
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    const barem = await prisma.barem.findUnique({
      where: { id }
    });
    
    if (barem?.filePath) {
      await deleteBaremPdf(barem.filePath);
    }
    
    await prisma.barem.delete({
      where: { id }
    });
    
    return { success: true };
  });
}
