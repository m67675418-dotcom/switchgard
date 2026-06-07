// DoctorGard.jsx - ✅ Complete Working Version
import { useState, useEffect } from "react";
import "./DoctorGard.css";
import GardeDetailModal from "../components/GardeDetailModal";

const TABS = ["All", "Active", "Inactive"];

export default function DoctorGard({ onNavigate, currentUser }) {
  const [gardes, setGardes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ owner: "", dateGarde: "", status: "Active" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedGarde, setSelectedGarde] = useState(null);

  const showToast = (text, type = "success") => { 
    setToast({ text, type }); 
    setTimeout(() => setToast(null), 3000); 
  };

  const fetchGardes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/garde/getAll")
      .then(r => r.json())
      .then(data => { 
        setGardes(Array.isArray(data) ? data : []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { 
    fetchGardes(); 
  }, []);

  const handleAdd = async () => {
    console.log('🔍 === Debug Add Gard ===');
    console.log('currentUser:', currentUser);
    console.log('currentUser._id:', currentUser?._id);
    console.log('currentUser.id:', currentUser?.id);
    console.log('form data:', form);
    
    if (!form.owner || !form.dateGarde) { 
      showToast("Please enter owner and date ⚠️", "error"); 
      return; 
    }
    
    const ownerId = currentUser?._id || currentUser?.id;
    console.log('✅ ownerId to send:', ownerId);
    
    if (!ownerId) {
      showToast("❌ Error: User ID not found! Please login again.", "error");
      console.error('❌ No userId found in currentUser!');
      return;
    }
    
    setSaving(true);
    try {
      const requestData = { 
        owner: form.owner, 
        dateGarde: form.dateGarde, 
        status: form.status || "Active",
        role: "doctor",
        ownerId: ownerId
      };
      
      console.log('📤 Sending to API:', JSON.stringify(requestData, null, 2));
      
      const response = await fetch("http://localhost:5000/api/garde/add", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (response.ok) {
        showToast("Gard added ✅");
        setForm({ owner: "", dateGarde: "", status: "Active" });
        setShowForm(false);
        fetchGardes();
      } else {
        showToast(`Failed: ${data.message || 'Server error'} ❌`, "error");
      }
    } catch (err) { 
      console.error('❌ Error:', err);
      showToast(`Failed: ${err.message} ❌`, "error"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this gard?")) return;
    try {
      await fetch(`http://localhost:5000/api/garde/${id}`, { method: "DELETE" });
      setGardes(p => p.filter(g => g._id !== id));
      showToast("Deleted ✅");
    } catch { 
      showToast("Failed to delete ❌", "error"); 
    }
  };

  const filtered = activeTab === "All" ? gardes : gardes.filter(g => g.status === activeTab);
  const fmt = d => { 
    try { 
      return new Date(d).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }); 
    } catch { 
      return d; 
    } 
  };

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toastSuccess" : "toastError"}`}>
          {toast.text}
        </div>
      )}

      {/* ✅ HEADER with Clear Add Button */}
      <div className="header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        background: "white",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <button 
          className="backBtn" 
          onClick={() => onNavigate?.("home")}
          style={{
            padding: "10px 20px",
            background: "#6b21a8",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ‹ Back
        </button>
        
        <h2 className="headerTitle" style={{
          margin: 0,
          fontSize: "24px",
          color: "#1e293b"
        }}>
          Guard Schedule
        </h2>
        
        <button 
          className="addBtn" 
          onClick={() => {
            console.log('➕ Add button clicked!');
            setShowForm(!showForm);
          }}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {showForm ? "✕ Cancel" : "➕ Add New Gard"}
        </button>
      </div>

      <div className="heroBand" style={{
        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
        padding: "40px",
        borderRadius: "16px",
        marginBottom: "30px",
        color: "white"
      }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>🛡 Guard Management</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Track and manage all doctor guard shifts</p>
      </div>

      <div className="mainContent">
        {/* Stats */}
        <div className="statsRow" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div className="statCard" style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <span className="statVal" style={{ fontSize: "36px", fontWeight: "bold", color: "#1a56db" }}>
              {gardes.length}
            </span>
            <span className="statLabel" style={{ display: "block", color: "#64748b", marginTop: "8px" }}>All</span>
          </div>
          
          <div className="statCard" style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <span className="statVal" style={{ fontSize: "36px", fontWeight: "bold", color: "#16a34a" }}>
              {gardes.filter(g => g.status === "Active").length}
            </span>
            <span className="statLabel" style={{ display: "block", color: "#64748b", marginTop: "8px" }}>Active</span>
          </div>
          
          <div className="statCard" style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <span className="statVal" style={{ fontSize: "36px", fontWeight: "bold", color: "#dc2626" }}>
              {gardes.filter(g => g.status === "Inactive").length}
            </span>
            <span className="statLabel" style={{ display: "block", color: "#64748b", marginTop: "8px" }}>Inactive</span>
          </div>
        </div>

        {/* ✅ ADD FORM */}
        {showForm && (
          <div className="gardForm" style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "24px",
            border: "2px solid #10b981"
          }}>
            <h4 className="formTitle" style={{
              fontSize: "18px",
              marginBottom: "20px",
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ➕ Add New Guard
            </h4>
            
            <div className="formGrid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px"
            }}>
              <div className="formGroup">
                <label style={{display: "block", marginBottom: "6px", fontWeight: "600", color: "#475569"}}>
                  Doctor Name *
                </label>
                <input 
                  type="text" 
                  placeholder="Dr. Smith" 
                  value={form.owner} 
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              
              <div className="formGroup">
                <label style={{display: "block", marginBottom: "6px", fontWeight: "600", color: "#475569"}}>
                  Date *
                </label>
                <input 
                  type="date" 
                  value={form.dateGarde} 
                  onChange={e => setForm({ ...form, dateGarde: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              
              <div className="formGroup">
                <label style={{display: "block", marginBottom: "6px", fontWeight: "600", color: "#475569"}}>
                  Status
                </label>
                <select 
                  value={form.status} 
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">❌ Inactive</option>
                </select>
              </div>
            </div>
            
            <button 
              className="saveBtn" 
              onClick={handleAdd} 
              disabled={saving}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                background: saving ? "#94a3b8" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {saving ? "⏳ Saving..." : "💾 Save Guard"}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs" style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px"
        }}>
          {TABS.map(t => (
            <button 
              key={t} 
              className={`tabBtn ${activeTab === t ? "tabActive" : ""}`} 
              onClick={() => setActiveTab(t)}
              style={{
                padding: "10px 24px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                background: activeTab === t ? "#2563eb" : "white",
                color: activeTab === t ? "white" : "#475569",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="loadingWrap" style={{ textAlign: "center", padding: "60px" }}>
            ⏳ Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty" style={{
            textAlign: "center",
            padding: "60px",
            background: "white",
            borderRadius: "12px"
          }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🛡</span>
            <p style={{ color: "#64748b" }}>No guards found</p>
          </div>
        ) : (
          <div className="list" style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            {filtered.map(g => (
              <div 
                key={g._id} 
                className="gardCard" 
                onClick={() => setSelectedGarde(g)} 
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="cardLeft" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div className="shiftBadge" style={{
                    fontSize: "32px",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eff6ff",
                    borderRadius: "8px"
                  }}>
                    🛡
                  </div>
                </div>
                
                <div className="cardMiddle" style={{ flex: 1 }}>
                  <h4 className="cardName" style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#1e293b" }}>
                    {g.owner}
                  </h4>
                  <p className="cardDate" style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "14px" }}>
                    📅 {fmt(g.dateGarde)}
                  </p>
                  {g.id && (
                    <p className="cardLoc" style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
                      🏷 ID: {g.id}
                    </p>
                  )}
                </div>
                
                <div className="cardRight" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`shiftLabel ${g.status === "Active" ? "statusActive" : "statusInactive"}`} 
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: g.status === "Active" ? "#d1fae5" : "#fee2e2",
                      color: g.status === "Active" ? "#065f46" : "#991b1b"
                    }}
                  >
                    {g.status}
                  </span>
                  <button 
                    className="deleteBtn" 
                    onClick={e => handleDelete(e, g._id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottomNav" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        padding: "12px",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.1)",
        zIndex: 100
      }}>
        <button className="navBtn" onClick={() => onNavigate?.("home")} style={{
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          color: "#64748b"
        }}>
          <span style={{ fontSize: "24px" }}>🏠</span>
          <span style={{ fontSize: "12px" }}>Home</span>
        </button>
        
        <button className="navBtn" onClick={() => onNavigate?.("message")} style={{
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          color: "#64748b"
        }}>
          <span style={{ fontSize: "24px" }}>💬</span>
          <span style={{ fontSize: "12px" }}>Messages</span>
        </button>
        
        <button className="navBtn navActive" style={{
          background: "#eff6ff",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          color: "#2563eb",
          padding: "8px 16px",
          borderRadius: "8px"
        }}>
          <span style={{ fontSize: "24px" }}>🛡</span>
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>Shifts</span>
        </button>
        
        <button className="navBtn" onClick={() => onNavigate?.("profile")} style={{
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          color: "#64748b"
        }}>
          <span style={{ fontSize: "24px" }}>👤</span>
          <span style={{ fontSize: "12px" }}>Profile</span>
        </button>
      </div>

      {/* Modal */}
      {selectedGarde && (
        <GardeDetailModal
          garde={selectedGarde}
          currentUser={currentUser}
          role="doctor"
          onClose={() => setSelectedGarde(null)}
          onDemande={() => { 
            setSelectedGarde(null); 
            showToast("Demande sent! ✅"); 
          }}
        />
      )}
    </div>
  );
}