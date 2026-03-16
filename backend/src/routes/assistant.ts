import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function getDatabaseContext(): Promise<string> {
  const [expeditions, companies, baremos, repairs] = await Promise.all([
    prisma.expedition.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { company: true }
    }),
    prisma.company.findMany({ orderBy: { name: 'asc' } }),
    prisma.barem.findMany({ 
      orderBy: { sector: 'asc' },
      include: { company: true }
    }),
    prisma.repair.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
  ]);

  let context = '=== DATOS DEL SISTEMA ===\n\n';

  context += '📋 EXPEDIENTES/SINIESTROS (' + expeditions.length + '):\n';
  if (expeditions.length > 0) {
    context += expeditions.map(e => 
      `- Código: ${e.code} | Cliente: ${e.clientName || 'Sin nombre'} | Teléfono: ${e.clientPhone || 'Sin teléfono'} | Compañía: ${e.company?.name || 'Sin compañía'} | Estado: ${e.status} | Ubicación: ${e.location || 'Sin ubicación'} | Fecha: ${e.date?.toISOString().split('T')[0]} | Descripción: ${e.description || 'Sin descripción'}`
    ).join('\n');
  } else {
    context += 'No hay expedientes\n';
  }

  context += '\n\n🏢 COMPAÑÍAS ASEGURADORAS (' + companies.length + '):\n';
  if (companies.length > 0) {
    context += companies.map(c => `- ${c.name}`).join('\n');
  } else {
    context += 'No hay compañías\n';
  }

  context += '\n\n💰 BAREMOS/TARIFAS (' + baremos.length + '):\n';
  if (baremos.length > 0) {
    const bySector: Record<string, typeof baremos> = {};
    for (const b of baremos) {
      if (!bySector[b.sector]) bySector[b.sector] = [];
      bySector[b.sector].push(b);
    }
    for (const [sector, items] of Object.entries(bySector)) {
      context += `\n=== SECTOR: ${sector} ===\n`;
      for (const b of items) {
        context += `\n📄 ${b.name} (${b.company?.name || 'Sin compañía'}):\n`;
        context += `   Precio: ${b.amount || 'Sin definir'}€${b.unit ? '/' + b.unit : ''}\n`;
        if (b.description) context += `   Descripción: ${b.description}\n`;
        if (b.notes) context += `   Notas: ${b.notes}\n`;
        if (b.extractedText) {
          context += `\n   📝 CONTENIDO DEL DOCUMENTO:\n${b.extractedText}\n`;
        }
      }
    }
  } else {
    context += 'No hay baremos\n';
  }

  context += '\n\n🔧 REPARADORES/TALLERES (' + repairs.length + '):\n';
  if (repairs.length > 0) {
    context += repairs.map(r => `- ${r.name} | Teléfono: ${r.phone || 'Sin teléfono'} | Especialidad: ${r.specialty || 'Sin especialidad'} | Estado: ${r.status}`).join('\n');
  } else {
    context += 'No hay reparadores\n';
  }

  return context;
}

const systemPrompt = `Eres ARTEM, un asistente de gestión de siniestros de seguros.

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE en español
- Sé útil y directo - responde a lo que te preguntan
- Cuando te pregunten por datos (expedientes, baremos, compañías), USA LOS DATOS REALES que te proporciono abajo
- NO digas "ve a", "dirígete a", "para ver esto" o "tienes que ir"
- Si hay datos, MUÉSTRALOS directamente en la respuesta
- Si no hay datos, simplemente dilo y ofrece ayuda
- Usa emojis cuando sea apropiado para hacer la respuesta más visual
- Sé conversacional y amigable`;

async function callAI(userMessage: string): Promise<string> {
  const dbContext = await getDatabaseContext();
  const fullSystem = `${systemPrompt}\n\n${dbContext}`;

  if (GROQ_API_KEY) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: fullSystem },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No he podido generar una respuesta.';
  }

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:8b',
      messages: [
        { role: 'system', content: fullSystem },
        { role: 'user', content: userMessage }
      ],
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`AI error: ${response.status}`);
  }

  const data = await response.json();
  return data.message.content;
}

export async function assistantRoutes(fastify: FastifyInstance) {
  fastify.post('/chat', {
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Body: { message: string } }>, reply: FastifyReply) => {
    const { message } = request.body;

    if (!message || !message.trim()) {
      return reply.status(400).send({ error: 'Message is required' });
    }

    try {
      const response = await callAI(message);
      return { response };
    } catch (error) {
      console.error('AI error:', error);
      return reply.status(500).send({
        response: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.'
      });
    }
  });

  fastify.get('/suggestions', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      suggestions: [
        '¿Qué expedientes tengo?',
        'Dame un resumen de mis datos',
        '¿Cómo funciona un seguro de hogar?',
        '¿Qué compañías tengo?',
        '¿Qué baremos tengo disponibles?'
      ]
    };
  });
}
