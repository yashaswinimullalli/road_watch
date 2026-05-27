import { MessageSquare, X, Send } from 'lucide-react';
import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Roady, your AI assistant. How can I help you today?", isBot: true }
  ]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-brand-500/30 transition-transform hover:scale-110 z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 glass-panel flex flex-col shadow-2xl z-50 animate-slide-up border border-white/10 overflow-hidden">
      <div className="bg-dark-800 p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-semibold text-white">Roady AI Support</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 h-64 p-4 overflow-y-auto bg-dark-900/50 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm ${
            msg.isBot 
              ? 'bg-dark-800 text-slate-200 rounded-tl-sm self-start border border-white/5' 
              : 'bg-brand-500 text-white rounded-tr-sm self-end shadow-lg shadow-brand-500/20'
          }`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-dark-800 border-t border-white/10 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
        />
        <button className="bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-xl transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
