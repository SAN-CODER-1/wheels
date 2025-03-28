import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function FirstAidBot() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "🚗 I'm your vehicle first aid assistant. What emergency are you facing?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const REACT_APP_HF_TOKEN = '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'; // For demo only - use env vars in production

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickResponses = [
    "🚨 Flat tire emergency",
    "🔥 Engine overheating",
    "🔋 Dead battery help",
    "🛑 Accident safety steps",
    "⚠️ Smoke from engine"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    // Add user message
    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      // Make API request
      const apiResponse = await axios.post(
        'https://api-inference.huggingface.co/models/google/flan-t5-base',
        {
          inputs: ` give 7 points for ${input} and include safty measures` ,
          options: {
            wait_for_model: true,
            use_cache: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${REACT_APP_HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
  
      // Safely extract response data
      const responseData = apiResponse?.data;
      const botText = responseData?.generated_text || getFallbackResponse(input);
  
      const botMessage = { 
        sender: 'bot', 
        text: formatResponse(botText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
  
    } catch (error) {
      // Handle different error scenarios
      const errorResponse = {
        text: getErrorResponse(error),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
  
      setMessages(prev => [...prev, {
        sender: 'bot',
        ...errorResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Improved error handling
  const getErrorResponse = (error) => {
    // Handle axios errors
    if (error.isAxiosError) {
      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 401:
            return "🔒 Authentication failed. Please check your API key.";
          case 503:
            const waitTime = error.response.data?.estimated_time || 30;
            return `⏳ Model is loading. Please try again in ${Math.ceil(waitTime)} seconds.`;
          default:
            return `⚠️ API Error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`;
        }
      } else if (error.request) {
        // No response received
        return "🌐 Network error. Please check your internet connection.";
      }
    }
    
    // Generic error fallback
    return "⚠️ Something went wrong. Safety tips:\n1. Turn on hazards\n2. Move to safe location\n3. Call for help";
  };
  
  // Fallback responses
  const getFallbackResponse = (input) => {
    const firstAidMap = {
      tire: "1. Find level ground\n2. Apply parking brake\n3. Use wheel wedges",
      battery: "1. Turn off electronics\n2. Locate jumper cables\n3. Call for help",
      overheat: "1. Turn off AC\n2. Turn on heater\n3. Stop driving immediately",
      accident: "1. Check for injuries\n2. Move to safety if possible\n3. Call emergency services",
      default: "1. Turn on hazard lights\n2. Move to safe location\n3. Call roadside assistance"
    };
  
    const key = Object.keys(firstAidMap).find(k => 
      input.toLowerCase().includes(k)
    );
    return firstAidMap[key] || firstAidMap.default;
  };
  
  const formatResponse = (text) => {
    if (!text) return getFallbackResponse('');
    return text
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.)/g, '<strong>$1</strong>');
  };


  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: '#f9f9f9'
    }}>
      <div style={{
        background: '#FFD700',
        color: '#333',
        padding: '16px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Vehicle Emergency Assistant</h3>
        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', opacity: 0.8 }}>Get immediate safety guidance</p>
      </div>

      <div style={{
        height: '400px',
        overflowY: 'auto',
        padding: '16px',
        background: '#fff'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '16px',
            display: 'flex',
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '18px',
              background: msg.sender === 'user' ? '#FFD700' : '#f0f0f0',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px'
            }}>
              {msg.sender === 'bot' && <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🛠️</span>}
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              <div style={{
                fontSize: '0.7rem',
                opacity: 0.6,
                marginTop: '4px',
                textAlign: msg.sender === 'user' ? 'right' : 'left'
              }}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start'
          }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: '18px',
              background: '#f0f0f0',
              borderBottomLeftRadius: '4px'
            }}>
              <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🛠️</span>
              <div style={{ display: 'flex', padding: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  margin: '0 2px',
                  background: '#666',
                  borderRadius: '50%',
                  opacity: 0.4,
                  animation: 'typingAnimation 1s infinite ease-in-out'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  margin: '0 2px',
                  background: '#666',
                  borderRadius: '50%',
                  opacity: 0.4,
                  animation: 'typingAnimation 1s infinite ease-in-out',
                  animationDelay: '0.2s'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  margin: '0 2px',
                  background: '#666',
                  borderRadius: '50%',
                  opacity: 0.4,
                  animation: 'typingAnimation 1s infinite ease-in-out',
                  animationDelay: '0.4s'
                }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        background: '#f5f5f5',
        borderTop: '1px solid #eee'
      }}>
        {quickResponses.map((response, index) => (
          <button
            key={index}
            onClick={() => setInput(response.replace(/^[^\w]+/, ''))}
            style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {response}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        padding: '12px',
        background: '#f0f0f0',
        borderTop: '1px solid #ddd'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your vehicle emergency..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          style={{
            background: '#FFD700',
            color: '#333',
            border: 'none',
            borderRadius: '20px',
            padding: '0 20px',
            marginLeft: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: isLoading || !input.trim() ? 0.6 : 1,
            pointerEvents: isLoading || !input.trim() ? 'none' : 'auto'
          }}
        >
          {isLoading ? (
            <span style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              borderTopColor: '#333',
              animation: 'spin 1s ease-in-out infinite'
            }}></span>
          ) : (
            'Send'
          )}
        </button>
      </form>
      <style>{`
        @keyframes typingAnimation {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}