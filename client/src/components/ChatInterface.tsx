import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your study assistant. Ask me anything about your course notes.", sender: 'bot' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: "I'm analyzing your notes... (This is a demo response. Backend integration required for real RAG).",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">EduPro AI</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions from your notes</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-100 dark:bg-indigo-900/20'
                            }`}>
                            {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                            ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your notes..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
