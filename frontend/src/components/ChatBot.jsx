import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/api';

const ChatBot = ({ courseTitle, courseContent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAI(input, courseContent, courseTitle);
      const aiMessage = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Assistant IA</h3>
        {courseTitle && <small>Contexte : {courseTitle}</small>}
      </div>

      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <p> Bonjour ! Je suis l'assistant IA de l'EST Salé.</p>
            <p>Posez-moi vos questions sur les cours !</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <strong>{msg.role === 'user' ? ' Vous' : ' IA'}</strong>
            <p style={{ margin: '5px 0 0' }}>{msg.content}</p>
          </div>
        ))}
        
        {isLoading && (
          <div style={styles.assistantMessage}>
            <strong>IA</strong>
            <p>Réflexion en cours...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Posez votre question..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          📤
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '450px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #ddd',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'center',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    backgroundColor: '#f9f9f9',
  },
  message: {
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    marginLeft: 'auto',
  },
  assistantMessage: {
    backgroundColor: '#e9ecef',
    color: '#333',
    marginRight: 'auto',
  },
  welcome: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  inputArea: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid #ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '25px',
    outline: 'none',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
};

export default ChatBot;