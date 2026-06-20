import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ManagerMessage.css';

const API = 'http://localhost:5000/api';

const ROLE_EMOJI = { doctor: '👨‍⚕️', nurse: '👩‍⚕️', pharmacist: '💊', firefighter: '🚒' };

const getName = (u) => u.fullName || u.nomPharmacie || u.matricule || u.userId || 'User';

export default function DDSMessage({ currentUser, openUserId }) {
  const [contacts, setContacts]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [sending, setSending]       = useState(false);
  const bottomRef                   = useRef(null);

  const me = currentUser?._id || currentUser?.id;

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/doctor/getAll`),
      axios.get(`${API}/nurse/getAll`),
      axios.get(`${API}/pharmacist/getAll`),
      axios.get(`${API}/firefighter/getAll`),
    ]).then(([d, n, p, f]) => {
      setContacts([
        ...d.data.map(u => ({ ...u, role: 'doctor' })),
        ...n.data.map(u => ({ ...u, role: 'nurse' })),
        ...p.data.map(u => ({ ...u, role: 'pharmacist' })),
        ...f.data.map(u => ({ ...u, role: 'firefighter' })),
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!openUserId || loading) return;
    const target = contacts.find(c => c._id === openUserId);
    if (target) setSelected(target);
  }, [openUserId, loading]);

  useEffect(() => {
    if (!selected || !me) return;
    axios.get(`${API}/message/conversation/${me}/${selected._id}`)
      .then(r => setMessages(r.data || []))
      .catch(() => setMessages([]));
  }, [selected, me]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected || sending) return;
    setSending(true);
    try {
      await axios.post(`${API}/message/add`, {
        senderId:   me,
        receiverId: selected._id,
        content:    text.trim(),
      });
      setText('');
      const r = await axios.get(`${API}/message/conversation/${me}/${selected._id}`);
      setMessages(r.data || []);
    } catch {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filtered = contacts.filter(c =>
    !search || getName(c).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dm-shell">
      {/* Sidebar — contact list */}
      <div className="dm-sidebar">
        <div className="dm-sidebar-header">
          <h2 className="dm-sidebar-title">💬 Messages</h2>
          <div className="dm-search">
            <span>🔍</span>
            <input
              placeholder="Search staff…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="dm-contact-list">
          {loading ? (
            [1,2,3,4,5].map(i => <div key={i} className="dm-skeleton" />)
          ) : filtered.length === 0 ? (
            <div className="dm-empty-list">No staff found</div>
          ) : filtered.map(c => (
            <div
              key={c._id}
              className={`dm-contact ${selected?._id === c._id ? 'dm-contact-active' : ''}`}
              onClick={() => setSelected(c)}
            >
              <div className="dm-avatar">{ROLE_EMOJI[c.role] || '👤'}</div>
              <div className="dm-contact-info">
                <span className="dm-contact-name">{getName(c)}</span>
                <span className="dm-contact-role">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="dm-chat">
        {selected ? (
          <>
            <div className="dm-chat-header">
              <div className="dm-avatar">{ROLE_EMOJI[selected.role] || '👤'}</div>
              <div>
                <div className="dm-chat-name">{getName(selected)}</div>
                <div className="dm-chat-role">{selected.role}</div>
              </div>
            </div>

            <div className="dm-messages">
              {messages.length === 0 ? (
                <div className="dm-empty-chat">
                  <span>💬</span>
                  <p>No messages yet — say hello!</p>
                </div>
              ) : messages.map(m => {
                const isMine = m.senderId === me;
                return (
                  <div key={m._id} className={`dm-bubble-row ${isMine ? 'dm-out' : 'dm-in'}`}>
                    <div className={`dm-bubble ${isMine ? 'dm-bubble-out' : 'dm-bubble-in'}`}>
                      {m.content}
                      <span className="dm-bubble-time">
                        {new Date(m.timestamp || m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form className="dm-input-bar" onSubmit={handleSend}>
              <input
                className="dm-input"
                placeholder="Type a message…"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button type="submit" className="dm-send-btn" disabled={sending || !text.trim()}>
                {sending ? '⏳' : '📤'}
              </button>
            </form>
          </>
        ) : (
          <div className="dm-no-chat">
            <span>💬</span>
            <p>Select a staff member to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
