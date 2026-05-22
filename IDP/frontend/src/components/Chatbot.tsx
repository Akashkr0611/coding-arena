import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your intelligent beach assistant. Ask me anything about Indian beaches, weather, or safety!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const cleanResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const beachContext = {
        currentPath: window.location.pathname,
        plannedTrip: JSON.parse(localStorage.getItem('trip') || '[]'),
      };

      const chatHistory = messages.slice(-5).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.text
      }));

      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, beachContext, history: chatHistory })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: cleanResponse(data.reply) }]);
    } catch (error) {
      console.error('Chat Frontend Error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: cleanResponse('Oops! I am having trouble connecting to the server.') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          id="chatbot-open-btn"
          className="chatbot-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open beach assistant"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <div className="chatbot-status" />
              <MessageSquare size={18} color="var(--teal)" />
              Beach Assistant AI
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => {
              const isLong = msg.role === 'bot' && msg.text.length > 300;
              return (
                <div
                  key={i}
                  className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                >
                  {isLong ? (
                    <>
                      {msg.text.substring(0, 300)}...
                      <div
                        style={{ marginTop: '6px', fontSize: '12px', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}
                        onClick={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).innerHTML = msg.text;
                        }}
                      >
                        Read more ↓
                      </div>
                    </>
                  ) : msg.text}
                </div>
              );
            })}

            {loading && (
              <div className="chat-typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              aria-label="Chat input"
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
