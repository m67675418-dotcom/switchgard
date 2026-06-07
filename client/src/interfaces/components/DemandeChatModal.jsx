import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DemandeChatModal.css';

const API = 'http://localhost:5000/api';

const DemandeChatModal = ({ demande, currentUser, onClose, onSendToDirector }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUserId = currentUser._id || currentUser.id;
  const otherUserId = demande.proprietaireId === currentUserId 
    ? demande.demandeurId 
    : demande.proprietaireId;

  const otherUserName = demande.proprietaireId === currentUserId
    ? demande.demandeurName
    : demande.gardeOwner;

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demande._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/message/conversation`, {
        params: { userId1: currentUserId, userId2: otherUserId }
      });
      setMessages(res.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API}/message/add`, {
        senderId: currentUserId,
        receiverId: otherUserId,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      alert('❌ Erreur d\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToDirector = async () => {
    if (!window.confirm('📤 Envoyer la demande au directeur DDS pour approbation finale?')) return;
    
    try {
      await axios.put(`${API}/demande/${demande._id}/send-to-director`);
      alert('✅ Demande envoyée au directeur!');
      if (onSendToDirector) onSendToDirector();
      onClose();
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const isMyMessage = (msg) => {
    const senderId = msg.senderId || msg.sender;
    return senderId === currentUserId;
  };

  return (
    <div className="dcm-overlay" onClick={onClose}>
      <div className="dcm-modal" onClick={e => e.stopPropagation()}>
        
        <div className="dcm-header">
          <div className="dcm-header-info">
            <div className="dcm-avatar">👤</div>
            <div>
              <h3>💬 Conversation avec {otherUserName}</h3>
              <p>
                📅 {new Date(demande.gardeDate).toLocaleDateString()} · 
                {demande.type === 'vente' ? ' 💰 Vente' : ' 🔄 Échange'}
              </p>
            </div>
          </div>
          <button className="dcm-close" onClick={onClose}>✕</button>
        </div>

        <div className="dcm-messages">
          {messages.length === 0 ? (
            <div className="dcm-empty">
              <div className="dcm-empty-icon">💬</div>
              <h4>Démarrez la conversation</h4>
              <p>Discutez avec {otherUserName} pour vous mettre d'accord sur l'échange/vente</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`dcm-message ${isMyMessage(msg) ? 'sent' : 'received'}`}
              >
                <div className="dcm-message-content">
                  {msg.content}
                </div>
                <span className="dcm-message-time">
                  {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="dcm-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="dcm-send-btn" disabled={loading || !newMessage.trim()}>
            {loading ? '⏳' : '📤'}
          </button>
        </form>

        <div className="dcm-footer">
          <button className="dcm-director-btn" onClick={handleSendToDirector}>
            📤 Envoyer au Directeur DDS pour approbation
          </button>
          <p className="dcm-footer-hint">
            ⚠️ Cliquez seulement après vous être mis d'accord
          </p>
        </div>

      </div>
    </div>
  );
};

export default DemandeChatModal;