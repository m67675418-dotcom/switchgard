import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DDSMessage.css';

const DDSMessage = ({ currentUser, onNavigate }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchChatMessages();
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const [doctors, nurses, pharmacists, firefighters] = await Promise.all([
        axios.get('http://localhost:5000/api/doctor/getAll'),
        axios.get('http://localhost:5000/api/nurse/getAll'),
        axios.get('http://localhost:5000/api/pharmacist/getAll'),
        axios.get('http://localhost:5000/api/firefighter/getAll')
      ]);

      const allUsers = [
        ...doctors.data.map(u => ({ ...u, type: 'doctor' })),
        ...nurses.data.map(u => ({ ...u, type: 'nurse' })),
        ...pharmacists.data.map(u => ({ ...u, type: 'pharmacist' })),
        ...firefighters.data.map(u => ({ ...u, type: 'firefighter' }))
      ];

      setConversations(allUsers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    if (!selectedUser || !currentUser) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/message/conversation?userId1=${currentUser._id || currentUser.id}&userId2=${selectedUser._id}`
      );
      setChatMessages(res.data || []);
    } catch (error) {
      setChatMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axios.post('http://localhost:5000/api/message/add', {
        senderId: currentUser._id || currentUser.id,
        receiverId: selectedUser._id,
        content: newMessage
      });
      setNewMessage('');
      fetchChatMessages();
    } catch (error) {
      alert('❌ Failed to send');
    }
  };

  const getAvatar = (type) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'pharmacist': return '💊';
      case 'firefighter': return '🚒';
      default: return '👤';
    }
  };

  if (loading) return <div className="loading">⏳ Loading...</div>;

  return (
    <div className="dds-message">
      {/* ✅ Back Button */}
      <button className="back-button" onClick={() => onNavigate?.('home')}>
        ← Back to Home
      </button>

      <div className="dds-message-header">
        <h1>💬 Messages</h1>
        <p>Communicate with staff</p>
      </div>

      <div className="message-container">
        <div className="conversations-list">
          <h3>Conversations</h3>
          {conversations.map((user) => (
            <div 
              key={user._id}
              className={`conversation-item ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="user-avatar">{getAvatar(user.type)}</div>
              <div className="user-info">
                <span className="user-name">
                  {user.fullName || user.nomPharmacie || user.matricule || 'User'}
                </span>
                <span className="user-type">{user.type}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="user-avatar">{getAvatar(selectedUser.type)}</div>
                  <div>
                    <h4>{selectedUser.fullName || 'User'}</h4>
                    <span className="user-type">{selectedUser.type}</span>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="empty-chat">
                    <p>No messages yet</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div 
                      key={msg._id}
                      className={`message-bubble ${msg.senderId === (currentUser._id || currentUser.id) ? 'sent' : 'received'}`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>

              <form className="message-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">📤 Send</button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <span>💬</span>
              <p>Select a user</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DDSMessage;