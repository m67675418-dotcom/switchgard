import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, FaPaperPlane, FaEllipsisV, FaPhone, FaVideo,
  FaImage, FaVideo as FaVideoIcon, FaMicrophone, FaTimes
} from 'react-icons/fa';
import './ChatPage.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const chatData = location.state || { 
    name: 'Unknown User', 
    emoji: '👤',
    specialty: 'General'
  };
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! How can I help you?', 
      sender: 'other', 
      time: '10:00 AM',
      type: 'text'
    },
  ]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle media selection
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (isImage || isVideo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedMedia({
            type: isImage ? 'image' : 'video',
            src: reader.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Send text message
  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === '' && !selectedMedia) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // Send media message
  const handleSendMedia = () => {
    if (!selectedMedia) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: selectedMedia.type,
      mediaSrc: selectedMedia.src,
      mediaName: selectedMedia.name,
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setSelectedMedia(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cancel media selection
  const handleCancelMedia = () => {
    setSelectedMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="chat-page-container">
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleMediaSelect}
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />

      {/* Header */}
      <header className="chat-header">
        <div className="header-left" onClick={() => navigate(-1)}>
          <FaArrowLeft className="back-icon" />
          <div className="chat-avatar-header">{chatData.emoji}</div>
          <div className="chat-info-header">
            <h3>{chatData.name}</h3>
            <span className="user-status">Online</span>
          </div>
        </div>
        <div className="header-actions">
          <FaPhone className="header-icon" title="Voice Call" />
          <FaVideo className="header-icon" title="Video Call" />
          <FaEllipsisV className="header-icon" title="More Options" />
        </div>
      </header>

      {/* Messages Area */}
      <div className="chat-body">
        <div className="date-separator">Today</div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
            {/* Text Message */}
            {msg.type === 'text' && (
              <>
                <p>{msg.text}</p>
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <span className={`message-status ${msg.status}`}>
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'delivered' && '✓✓'}
                      {msg.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Image Message */}
            {msg.type === 'image' && (
              <div className="media-message">
                <img src={msg.mediaSrc} alt="Shared" className="shared-image" />
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            )}

            {/* Video Message */}
            {msg.type === 'video' && (
              <div className="media-message">
                <video src={msg.mediaSrc} controls className="shared-video" />
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {selectedMedia && (
        <div className="media-preview">
          <div className="preview-content">
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.src} alt="Preview" className="preview-image" />
            ) : (
              <video src={selectedMedia.src} className="preview-video" />
            )}
            <button className="cancel-media-btn" onClick={handleCancelMedia}>
              <FaTimes />
            </button>
          </div>
          <button className="send-media-btn" onClick={handleSendMedia}>
            <FaPaperPlane /> Send
          </button>
        </div>
      )}

      {/* Input Area */}
      <form className="chat-footer" onSubmit={handleSend}>
        <div className="input-wrapper">
          <button 
            type="button" 
            className="attach-btn"
            onClick={openFilePicker}
            title="Attach photo/video"
          >
            <FaImage />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={message.trim() === '' && !selectedMedia}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>

    </div>
  );
};

export default ChatPage;