import { useState, useEffect } from "react";
import "./NurseMessage.css";

export default function NurseMessage({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newMsg, setNewMsg] = useState({ sender: "", receiver: "", content: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = () => {
    fetch("http://localhost:5000/api/message/getAll")
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleSend = async () => {
    if (!newMsg.sender || !newMsg.receiver || !newMsg.content) return;
    setSending(true);
    try {
      await fetch("http://localhost:5000/api/message/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      showToast("Message sent successfully ✅");
      setNewMsg({ sender: "", receiver: "", content: "" });
      setShowForm(false);
      fetchMessages();
    } catch {
      showToast("Failed to send message ❌", "error");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/message/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      showToast("Message deleted ✅");
    } catch {
      showToast("Failed to delete ❌", "error");
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.sender?.toLowerCase().includes(search.toLowerCase()) ||
      m.receiver?.toLowerCase().includes(search.toLowerCase()) ||
      m.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toastSuccess" : "toastError"}`}>
          {toast.text}
        </div>
      )}

      <div className="header">
        <button className="backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="headerTitle">Messages</h2>
        <button className="addBtn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕" : "✏️"}
        </button>
      </div>

      <div className="searchBox">
        <span>🔍</span>
        <input
          className="searchInput"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="msgForm">
          <h4 className="formTitle">New Message</h4>
          <div className="formGroup">
            <label>From</label>
            <input type="text" placeholder="Sender name" value={newMsg.sender} onChange={(e) => setNewMsg({ ...newMsg, sender: e.target.value })} />
          </div>
          <div className="formGroup">
            <label>To</label>
            <input type="text" placeholder="Receiver name" value={newMsg.receiver} onChange={(e) => setNewMsg({ ...newMsg, receiver: e.target.value })} />
          </div>
          <div className="formGroup">
            <label>Message</label>
            <textarea placeholder="Type your message here..." value={newMsg.content} onChange={(e) => setNewMsg({ ...newMsg, content: e.target.value })} rows={3} />
          </div>
          <button className="sendBtn" onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "📤 Send"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty"><span>💬</span><p>No messages found</p></div>
      ) : (
        <div className="list">
          {filtered.map((m) => (
            <div key={m._id} className="msgCard">
              <div className="msgAvatar">💬</div>
              <div className="msgBody">
                <div className="msgTop">
                  <span className="msgSender">{m.sender}</span>
                  <span className="msgTime">{new Date(m.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="msgTo">To: {m.receiver}</p>
                <p className="msgContent">{m.content}</p>
              </div>
              <button className="deleteBtn" onClick={() => handleDelete(m._id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      <div className="bottomNav">
        <button className="navBtn" onClick={() => onNavigate?.("home")}>🏠</button>
        <button className="navBtn navActive" onClick={() => onNavigate?.("messages")}>💬</button>
        <button className="navBtn" onClick={() => onNavigate?.("garde")}>🛡️</button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}>👤</button>
      </div>
    </div>
  );
}