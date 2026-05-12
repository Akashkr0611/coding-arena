import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import apiClient from '../api/client';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hi! I am your intelligent beach assistant. Ask me anything about Indian beaches, weather, or safety!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Build a smart context
      const beachContext = {
        currentPath: window.location.pathname,
        plannedTrip: JSON.parse(localStorage.getItem('trip') || '[]'),
      };
      
      // Extract last 5 messages for memory context (excluding the one we just added locally)
      const chatHistory = messages.slice(-5).map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          content: m.text
      }));

      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          beachContext,
          history: chatHistory
        })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      console.error("Chat Frontend Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Oops! I am having trouble connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#38bdf8', color: '#0f172a', border: 'none',
          borderRadius: '50%', width: '60px', height: '60px',
          display: open ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', cursor: 'pointer', zIndex: 9999
        }}
      >
        <MessageSquare size={30} />
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '350px', height: '500px', background: '#1e293b',
          borderRadius: '16px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', zIndex: 9999,
          border: '1px solid #334155', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MessageSquare size={20} color="#38bdf8" style={{ marginRight: '8px' }} />
              <strong style={{ color: 'white' }}>Beach Assistant AI</strong>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => {
              const isLong = msg.role === 'bot' && msg.text.length > 300;
              return (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <div style={{
                    padding: '10px 14px', borderRadius: '12px',
                    background: msg.role === 'user' ? '#38bdf8' : '#334155',
                    color: msg.role === 'user' ? '#0f172a' : 'white',
                    fontSize: '14px', lineHeight: '1.4',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {isLong ? (
                      <>
                        {msg.text.substring(0, 300)}...
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => {
                          e.currentTarget.parentElement!.innerHTML = msg.text;
                        }}>
                          Read more
                        </div>
                      </>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#334155', padding: '10px 14px', borderRadius: '12px', color: '#94a3b8', fontSize: '14px' }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '16px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: 'none', background: '#1e293b', color: 'white', outline: 'none' }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ background: '#38bdf8', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#0f172a' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
