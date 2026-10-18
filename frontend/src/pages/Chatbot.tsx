import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

const normalizeMarkdown = (rawText: string) => {
  if (!rawText) return "";
  return String(rawText)
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .trim();
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your Fasal Mitra Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);



    try {
      // Send to backend
      const response = await api.post('/chat', {
        message: input,
        history: messages.map(m => ({ sender: m.sender, text: m.text }))
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to the farm server right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100dvh-10.5rem)] sm:h-[calc(100dvh-9rem)] lg:h-[calc(100vh-9.5rem)] min-h-[440px] flex flex-col animate-fade-in px-0 sm:px-1">
      <div className="mb-2.5 sm:mb-4 space-y-0.5 shrink-0 px-0.5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight break-words">
          Agronomic AI Assistant
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Query pest treatments, nutrient timings, or regional market guidelines.
        </p>
      </div>

      <Card padding="none" className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-card w-full">
        {/* Message History with Independent Scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4 bg-[#FAF9F5] custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up w-full`}
            >
              <div
                className={`flex max-w-[92%] sm:max-w-[84%] lg:max-w-[78%] gap-2 sm:gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-soft ${
                    msg.sender === 'user' ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-200 text-emerald-800'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </div>
                <div
                  className={`rounded-2xl sm:rounded-3xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 shadow-soft min-w-0 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-sm sm:rounded-tr-md'
                      : 'bg-white border border-stone-200/80 text-stone-800 rounded-tl-sm sm:rounded-tl-md'
                  }`}
                >
                  <div className={`text-xs sm:text-sm md:text-base break-words prose max-w-none ${msg.sender === 'user' ? 'prose-invert text-white' : 'prose-sm text-stone-800'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                      components={{
                        p: ({ ...props }) => <p className="mb-2 leading-relaxed break-words" {...props} />,
                        ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({ ...props }) => <li className="mb-0.5 break-words" {...props} />,
                        strong: ({ ...props }) => <strong className={`font-bold ${msg.sender === 'user' ? 'text-white' : 'text-stone-900'}`} {...props} />,
                        pre: ({ ...props }) => <pre className="overflow-x-auto max-w-full p-3 rounded-xl bg-stone-900 text-stone-100 text-xs my-2 custom-scrollbar" {...props} />,
                        code: ({ ...props }) => <code className="break-words px-1 py-0.5 rounded bg-stone-100 text-emerald-800 text-xs font-mono" {...props} />,
                        table: ({ ...props }) => (
                          <div className="overflow-x-auto my-3 rounded-2xl border border-stone-200 bg-white shadow-soft max-w-full">
                            <table className="min-w-full divide-y divide-stone-200 text-left text-xs" {...props} />
                          </div>
                        ),
                        thead: ({ ...props }) => <thead className="bg-[#FAF9F5] text-stone-900 font-bold" {...props} />,
                        tbody: ({ ...props }) => <tbody className="divide-y divide-stone-100 bg-white" {...props} />,
                        tr: ({ ...props }) => <tr className="hover:bg-[#FAF9F5]/70" {...props} />,
                        th: ({ ...props }) => <th className="px-3.5 py-2.5 font-bold text-stone-800 uppercase text-[10px] tracking-wider" {...props} />,
                        td: ({ ...props }) => <td className="px-3.5 py-2.5 text-stone-700 align-top break-words" {...props} />,
                      }}
                    >
                      {normalizeMarkdown(msg.text)}
                    </ReactMarkdown>
                  </div>
                  <span className={`text-[10px] mt-1 sm:mt-1.5 block font-medium ${msg.sender === 'user' ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl sm:rounded-2xl bg-white border border-stone-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-soft">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-sm sm:rounded-tl-md px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-soft">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Composer */}
        <div className="p-2.5 sm:p-3.5 lg:p-4 bg-white border-t border-stone-200/80 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-2.5 w-full">
            <div className="flex-1 min-w-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fertilizer doses, pest remedies, crop timing..."
                className="rounded-2xl text-xs sm:text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="shrink-0 rounded-2xl px-3 sm:px-5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-soft active:scale-95 transition-all"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
