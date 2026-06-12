import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Signup.css';

const Signup = ({ onSignupSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole]       = useState('');

  // Location for map
  const [address, setAddress]   = useState('');
  const [wilaya, setWilaya]     = useState('');

  // Doctor
  const [fullName, setFullName]   = useState('');
  const [specialty, setSpecialty] = useState('');
  const [numOrdre, setNumOrdre]   = useState('');

  // Nurse
  const [diplome, setDiplome] = useState('');
  const [service, setService] = useState('');
  const [equipe, setEquipe]   = useState('');

  // Pharmacist
  const [nomPharmacie, setNomPharmacie] = useState('');
  const [numAgrement, setNumAgrement]   = useState('');

  // Firefighter
  const [matricule, setMatricule]               = useState('');
  const [grade, setGrade]                       = useState('');
  const [uniteIntervention, setUniteIntervention] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const specialtyOptions = ['Cardiology','Pediatrics','Dermatology','Orthopedics','Neurology','General Practice','Surgery','Psychiatry'];

  const wilayas = [
    "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Bejaia","Biskra","Bechar",
    "Blida","Bouira","Tamanrasset","Tebessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
    "Djelfa","Jijel","Setif","Saida","Skikda","Sidi Bel Abbes","Annaba","Guelma",
    "Constantine","Medea","Mostaganem","Msila","Mascara","Ouargla","Oran","El Bayadh",
    "Illizi","Bordj Bou Arreridj","Boumerdes","El Tarf","Tindouf","Tissemsilt",
    "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Ain Defla","Naama",
    "Ain Temouchent","Ghardaia","Relizane","Touggourt","El Menia"
  ];

  // ✅ Geocode address using OpenStreetMap
  const geocodeAddress = async (fullAddress) => {
    try {
      const encoded = encodeURIComponent(fullAddress + ', Algeria');
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (e) {
      console.warn('Geocoding failed:', e);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');

    if (password !== confirmPassword) { setError('⚠️ Passwords do not match'); setLoading(false); return; }
    if (!selectedRole)                { setError('⚠️ Please select a role');    setLoading(false); return; }
    if (!wilaya)                      { setError('⚠️ Please select your wilaya'); setLoading(false); return; }

    // ✅ Geocode the real address
    setSuccess('📍 Getting your location coordinates...');
    const fullAddress  = address ? `${address}, ${wilaya}` : wilaya;
    const coords       = await geocodeAddress(fullAddress);
    const lat          = coords?.lat || null;
    const lng          = coords?.lng || null;
    const locationStr  = fullAddress;

    setSuccess('');

    let additionalData = {};
    switch (selectedRole) {
      case 'doctor':
        additionalData = { fullName, specialty, numOrdre, location: locationStr, lat, lng };
        break;
      case 'nurse':
        additionalData = { diplome, service, equipe, location: locationStr, lat, lng };
        break;
      case 'pharmacist':
        additionalData = { nomPharmacie, adressePharmacie: address || wilaya, numAgrement, location: locationStr, lat, lng };
        break;
      case 'firefighter':
        additionalData = { matricule, grade, uniteIntervention, location: locationStr, lat, lng };
        break;
      default: break;
    }

    const formData = { email: email.toLowerCase(), password, role: selectedRole, ...additionalData };

    try {
      const response = await fetch('http://localhost:5000/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.pending) {
        navigate('/pending-approval');
      } else if (data.token) {
        // Shouldn't happen for public signup, but handle just in case
        const userData = data.user || {};
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (onSignupSuccess) onSignupSuccess(userData);
        navigate('/dashboard');
      } else {
        setError(data.message || '❌ Registration failed');
      }
    } catch (err) {
      setError('❌ Server error, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* ── LEFT PANEL ── */}
      <div className="signup-left">
        <div className="signup-left-content">
          <img src={logo} alt="SwitchGard" className="signup-logo" />
          <h1 className="signup-brand">SwitchGard</h1>
          <p className="signup-brand-sub">Join the medical guard management platform</p>
          <div className="signup-steps">
            <div className="signup-step">
              <span className="signup-step-num">1</span>
              <span className="signup-step-text">Choose your role</span>
            </div>
            <div className="signup-step">
              <span className="signup-step-num">2</span>
              <span className="signup-step-text">Enter your real address</span>
            </div>
            <div className="signup-step">
              <span className="signup-step-num">3</span>
              <span className="signup-step-text">Appear on the map! 📍</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="signup-right">
        <div className="signup-card">

          <div className="signup-logo-wrap">
            <img src={logo} alt="SwitchGard" className="signup-logo-mobile" />
          </div>

          <h2 className="signup-card-title">Create account 🎉</h2>
          <p className="signup-card-sub">Fill in your details to get started</p>

          {error   && <div className="status-message error">{error}</div>}
          {success && <div className="status-message success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* ── Basic Info ── */}
            <input type="email"    placeholder="📧 Email Address"    value={email}           onChange={e=>setEmail(e.target.value)}           required />
            <input type="password" placeholder="🔐 Password"         value={password}        onChange={e=>setPassword(e.target.value)}        required />
            <input type="password" placeholder="🔐 Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />

            {/* ── Role ── */}
            <select value={selectedRole} onChange={e=>setSelectedRole(e.target.value)} required className="form-select">
              <option value="">-- Select Your Role --</option>
              <option value="doctor">👨‍⚕️ Doctor</option>
              <option value="nurse">👩‍⚕️ Nurse</option>
              <option value="pharmacist">💊 Pharmacist</option>
              <option value="firefighter">🚒 Firefighter</option>
            </select>

            {/* ✅ Location section */}
            <div className="location-section">
              <p className="location-title">📍 Your Location (for the map)</p>
              <select value={wilaya} onChange={e=>setWilaya(e.target.value)} required className="form-select">
                <option value="">-- Select Wilaya --</option>
                {wilayas.map(w=><option key={w} value={w}>{w}</option>)}
              </select>
              <input
                type="text"
                placeholder="🏥 Exact address (hospital, clinic, unit...)"
                value={address}
                onChange={e=>setAddress(e.target.value)}
              />
              <p className="location-hint">💡 The more precise your address, the better you appear on the map</p>
            </div>

            {/* ── Doctor Fields ── */}
            {selectedRole === 'doctor' && (
              <div className="role-fields-section">
                <p className="role-fields-title">👨‍⚕️ Doctor Information</p>
                <input type="text" placeholder="👤 Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
                <select value={specialty} onChange={e=>setSpecialty(e.target.value)} required className="form-select">
                  <option value="">-- Select Specialty --</option>
                  {specialtyOptions.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" placeholder="🔢 Num Ordre" value={numOrdre} onChange={e=>setNumOrdre(e.target.value)} required />
              </div>
            )}

            {/* ── Nurse Fields ── */}
            {selectedRole === 'nurse' && (
              <div className="role-fields-section">
                <p className="role-fields-title">👩‍⚕️ Nurse Information</p>
                <select value={diplome} onChange={e=>setDiplome(e.target.value)} required className="form-select">
                  <option value="">-- Select Diploma --</option>
                  <option value="IDE">IDE</option>
                  <option value="ISP">ISP</option>
                </select>
                <input type="text" placeholder="🏥 Service" value={service} onChange={e=>setService(e.target.value)} required />
                <input type="text" placeholder="👥 Equipe"  value={equipe}  onChange={e=>setEquipe(e.target.value)}  required />
              </div>
            )}

            {/* ── Pharmacist Fields ── */}
            {selectedRole === 'pharmacist' && (
              <div className="role-fields-section">
                <p className="role-fields-title">💊 Pharmacist Information</p>
                <input type="text" placeholder="🏪 Pharmacy Name"   value={nomPharmacie} onChange={e=>setNomPharmacie(e.target.value)} required />
                <input type="text" placeholder="📋 Approval Number" value={numAgrement}  onChange={e=>setNumAgrement(e.target.value)}  required />
              </div>
            )}

            {/* ── Firefighter Fields ── */}
            {selectedRole === 'firefighter' && (
              <div className="role-fields-section">
                <p className="role-fields-title">🚒 Firefighter Information</p>
                <input type="text" placeholder="🔢 Matricule" value={matricule}         onChange={e=>setMatricule(e.target.value)}         required />
                <input type="text" placeholder="⭐ Grade"     value={grade}             onChange={e=>setGrade(e.target.value)}             required />
                <input type="text" placeholder="🚒 Unit"      value={uniteIntervention} onChange={e=>setUniteIntervention(e.target.value)} required />
              </div>
            )}


            <button type="submit" className="main-btn" disabled={loading}>
              {loading ? '⏳ Creating Account...' : '✅ Create Account'}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{' '}
            <button onClick={()=>navigate('/')} className="link-btn">Sign in</button>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;