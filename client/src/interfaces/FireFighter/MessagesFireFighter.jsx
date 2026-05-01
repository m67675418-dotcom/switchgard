// MessagesFireFighter.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './MessagesFireFighter.css';

const MessagesFireFighter = () => {
  const navigate = useNavigate();
  const chats = [
    { id: 1, name: 'Lt. Ahmed Boudiaf', msg: 'Cover my shift tomorrow?', time: '10:00 AM' },
    { id: 2, name: 'Sgt. Khalid Merzak', msg: 'Unit 4 is ready.', time: 'Yesterday' }
  ];

  return (
    <div className="messages-ff-container">
      <div className="messages-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/home-firefighter')} />
        <h2>Firefighter Chats</h2>
        <FaSearch className="search-icon-msg" />
      </div>

      <div className="chats-list">
        {chats.map(chat => (
          <div key={chat.id} className="chat-card" onClick={() => navigate(`/chat-ff/${chat.id}`)}>
            <div className="chat-avatar">🚒</div>
            <div className="chat-info">
              <h4 className="chat-name">{chat.name}</h4>
              <p className="chat-msg">{chat.msg}</p>
            </div>
            <span className="chat-time">{chat.time}</span>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default MessagesFireFighter;