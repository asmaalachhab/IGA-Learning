import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
};

const SUGGESTED_QUESTIONS = [
  "Comment m'inscrire à un cours ?",
  "Comment obtenir mon certificat ?",
  "Quels sont les cours gratuits ?",
  "Comment contacter un professeur ?"
];

const LOCAL_RESPONSES: Record<string, string> = {
  "inscription": "Pour vous inscrire, créez un compte étudiant, allez sur la page 'Explorer' et cliquez sur le cours qui vous intéresse, puis sur 'S'inscrire'.",
  "inscrire": "Pour vous inscrire, créez un compte étudiant, allez sur la page 'Explorer' et cliquez sur le cours qui vous intéresse, puis sur 'S'inscrire'.",
  "certificat": "Vous obtenez un certificat une fois que vous avez terminé toutes les leçons d'un cours et obtenu au moins 70% au quiz final.",
  "gratuit": "Certains de nos cours d'introduction sont gratuits. Vous pouvez les trouver en filtrant par prix dans le catalogue.",
  "professeur": "Vous pouvez contacter un professeur directement depuis votre tableau de bord étudiant, dans la section 'Mes Cours' > 'Contacter l'enseignant'.",
  "bonjour": "Bonjour ! Je suis l'assistant virtuel IGA Learning. Comment puis-je vous aider aujourd'hui ?",
  "salut": "Salut ! Comment puis-je vous aider à développer vos compétences aujourd'hui ?",
  "aide": "Je peux répondre à vos questions sur les inscriptions, les certificats, les cours, ou vous guider sur la plateforme.",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Bonjour ! Je suis l'assistant IGA Learning. Comment puis-je vous aider ?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getBotResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    // Check local dictionary
    for (const [key, response] of Object.entries(LOCAL_RESPONSES)) {
      if (text.includes(key)) {
        return response;
      }
    }
    
    return "Je suis désolé, je ne comprends pas cette question. Pourriez-vous reformuler ou contacter le support à contact@iga-learning.com ?";
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate thinking delay
    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="size-5" />
              </div>
              <div>
                <h3 className="font-bold">Assistant IGA</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-400"></span> En ligne
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-teal-500 text-white'}`}>
                    {msg.sender === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-4 pb-2 bg-slate-50">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="size-3 text-teal-500" /> Suggestions
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2 text-sm transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0' : 'scale-100'} transition-transform duration-300 bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center relative group`}
      >
        <MessageSquare className="size-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
}
