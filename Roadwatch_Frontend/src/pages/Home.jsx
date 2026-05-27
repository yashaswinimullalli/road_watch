import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, LayoutDashboard, HelpCircle, Phone, Clock, FileText, CheckCircle2 } from 'lucide-react';
import UploadImage from '../components/UploadImage';
import LetterEditor from '../components/LetterEditor';

export default function Home() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am Sathi, your friendly infrastructure assistant. How can I help you today?",
      options: [
        { id: 'report', label: 'Report a Problem', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'dashboard', label: 'View City Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'help', label: 'How RoadSathi Works', icon: <HelpCircle className="w-4 h-4" /> },
        { id: 'support', label: 'Contact Support', icon: <Phone className="w-4 h-4" /> },
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock User History Data
  const reportingHistory = [
    { id: 1, type: 'Pothole Report', date: 'Yesterday', status: 'In Progress', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
    { id: 2, type: 'Streetlight Outage', date: 'May 12', status: 'Resolved', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { id: 3, type: 'Contacted Support', date: 'April 28', status: 'Closed', icon: <Phone className="w-4 h-4 text-slate-500" /> }
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = (option) => {
    if (option.id === 'dashboard') {
      navigate('/admin');
      return;
    }
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: option.label }]);
    setIsTyping(true);

    if (option.id === 'report') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: "Please capture or upload a geotagged photo of the issue. I will analyze it and draft a formal complaint letter for the authorities.",
            component: 'upload'
          }
        ]);
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      let botResponse = "I can certainly help you with that!";
      if (option.id === 'help') {
        botResponse = "RoadSathi empowers citizens to report potholes, broken signals, and road hazards directly to local authorities with a single snap. Our AI automatically tags the location and issue type!";
      } else if (option.id === 'support') {
        botResponse = "You can reach our city support team at support@roadsathi.city or call 311 for non-emergency municipal services.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleUserMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "I am currently in demo mode. Please click 'Report a Problem' to see my Generative UI capabilities in action!" 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleImageUpload = (imgData) => {
    if (!imgData) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      const generatedLetter = `To the Department of Public Works,
City Municipal Office

Subject: Urgent Action Required - Road Infrastructure Damage

Dear Sir/Madam,

I am writing to formally report a significant infrastructure issue located at [GPS: 40.7128° N, 74.0060° W] (Estimated: 124 West Main St). 

Based on photographic evidence gathered on ${new Date().toLocaleDateString()}, there is a large pothole approximately 2 feet in diameter situated in the middle lane. This presents an immediate hazard to passing vehicles and requires urgent maintenance.

I request that this issue be inspected and resolved at the earliest opportunity to prevent accidents or vehicle damage.

Sincerely,
A Concerned Citizen`;

      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          sender: 'bot', 
          text: "I have analyzed the geotagged photo. It appears to be a large pothole. I've drafted a formal complaint letter for you. You can improvise or edit the words before submitting.",
          component: 'letter',
          letterContent: generatedLetter
        }
      ]);
      setIsTyping(false);
    }, 3000);
  };

  const handleLetterSubmit = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          sender: 'bot', 
          text: "Excellent! Your report has been officially filed. You can track community issues and view the updated poll on the Dashboard.",
          options: [
            { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
          ]
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-[calc(100vh-140px)] flex gap-6">
      
      {/* Left Sidebar - User History (Visible on large screens) */}
      <div className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300 shrink-0">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Your History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recent activity and reports</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reportingHistory.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-500">{item.date}</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  item.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full py-2.5 px-4 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium text-sm rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> View All Reports
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in w-full`}>
              <div className={`flex w-full ${msg.component ? 'max-w-full' : 'max-w-[85%] md:max-w-[70%]'} gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white' 
                    : 'bg-brand-500 text-white'
                }`}>
                  {msg.sender === 'user' ? 'U' : 'S'}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col gap-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'} ${msg.component ? 'w-full pr-14' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tr-sm border border-slate-200 dark:border-slate-700' 
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/50'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Inline Components (Generative UI) */}
                  {msg.component === 'upload' && (
                    <div className="w-full max-w-xl animate-fade-in">
                      <UploadImage onImageSet={handleImageUpload} />
                    </div>
                  )}
                  
                  {msg.component === 'letter' && (
                    <div className="w-full max-w-2xl animate-fade-in">
                      <LetterEditor initialContent={msg.letterContent} onSubmit={handleLetterSubmit} />
                    </div>
                  )}

                  {/* Options (if any) */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionClick(opt)}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  S
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 flex items-center gap-1.5 h-12 shadow-sm">
                  <div className="w-2 h-2 bg-brand-500 dark:bg-brand-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-500 dark:bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-brand-500 dark:bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleUserMessage(inputText); }}
            className="relative max-w-4xl mx-auto flex items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message Sathi..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`absolute right-2 p-2.5 rounded-xl flex items-center justify-center transition-all ${
                inputText.trim() 
                  ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-3">
            Sathi AI can make mistakes. Please verify important municipal information.
          </p>
        </div>
      </div>
    </div>
  );
}
