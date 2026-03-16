'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Send, Mic, MicOff, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AsistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy ARTEM, tu asistente de gestión de siniestros. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'He encontrado el expediente SIN-2026-001. Está en proceso de valoración. ¿Necesitas más información sobre este siniestro?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-violet-400" />
              Asistente ARTEM
            </h1>
            <p className="text-slate-400 mt-1">Tu asistente IA para gestión de siniestros</p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-slate-800 text-slate-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-3">
                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje o usa la voz..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                🎤 Di "Hey ARTEM" para activar comandos de voz
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
