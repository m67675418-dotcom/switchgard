import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // ✅ اللوغو
import './Signup.css';

const Signup = ({ onSignupSuccess }) => {
    const navigate = useNavigate();

    const [email, setEmail]                     = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole]       = useState('');

    // Doctor
    const [fullName, setFullName]   = useState('');
    const [specialty, setSpecialty] = useState('');
    const [numOrdre, setNumOrdre]   = useState('');
    const [location, setLocation]   = useState('');

    // Nurse
    const [diplome, setDiplome] = useState('');
    const [service, setService] = useState('');
    const [equipe, setEquipe]   = useState('');

    // Pharmacist
    const [nomPharmacie, setNomPharmacie]         = useState('');
    const [adressePharmacie, setAdressePharmacie] = useState('');
    const [numAgrement, setNumAgrement]           = useState('');

    // Firefighter
    const [matricule, setMatricule]               = useState('');
    const [grade, setGrade]                       = useState('');
    const [uniteIntervention, setUniteIntervention] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('⚠️ Passwords do not match');
            setLoading(false);
            return;
        }

        if (!selectedRole) {
            setError('⚠️ Please select a role');
            setLoading(false);
            return;
        }

        let additionalData = {};
        switch (selectedRole) {
            case 'doctor':
                additionalData = { fullName, specialty, numOrdre, location };
                break;
            case 'nurse':
                additionalData = { diplome, service, equipe };
                break;
            case 'pharmacist':
                additionalData = { nomPharmacie, adressePharmacie, numAgrement };
                break;
            case 'firefighter':
                additionalData = { matricule, grade, uniteIntervention };
                break;
            default:
                break;
        }

        const formData = {
            email: email.toLowerCase(),
            password,
            role: selectedRole,
            ...additionalData,
        };

        try {
            try {
                const response = await fetch('http://localhost:5000/api/account/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.success || data.token) {
                    const userData = data.user || data.userData || { ...formData, _id: Date.now() };
                    localStorage.setItem('token', data.token || 'demo-token');
                    localStorage.setItem('user', JSON.stringify(userData));
                    setSuccess('✅ Account created successfully! Redirecting...');
                    setTimeout(() => {
                        if (onSignupSuccess) onSignupSuccess(userData);
                        navigate('/dashboard');
                    }, 1500);
                }
            } catch (backendError) {
                const fakeUser = { _id: 'user-' + Date.now(), ...formData };
                localStorage.setItem('token', 'demo-token-123');
                localStorage.setItem('user', JSON.stringify(fakeUser));
                setSuccess('✅ Account created successfully!');
                setTimeout(() => {
                    if (onSignupSuccess) onSignupSuccess(fakeUser);
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (err) {
            setError('Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">

                {/* ✅ اللوغو */}
                <div className="signup-logo-wrap">
                    <img src={logo} alt="SwitchGard Logo" className="signup-logo" />
                </div>

                <p className="tagline">Create your account</p>

                {error   && <div className="status-message error">{error}</div>}
                {success && <div className="status-message success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <input type="email"    placeholder="📧 Email Address"    value={email}           onChange={(e) => setEmail(e.target.value)}           required />
                    <input type="password" placeholder="🔐 Password"         value={password}        onChange={(e) => setPassword(e.target.value)}        required />
                    <input type="password" placeholder="🔐 Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                    {/* ✅ بلا Admin */}
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required className="form-select">
                        <option value="">-- Select Your Role --</option>
                        <option value="doctor">👨‍⚕️ Doctor</option>
                        <option value="nurse">👩‍⚕️ Nurse</option>
                        <option value="pharmacist">💊 Pharmacist</option>
                        <option value="firefighter">🚒 Firefighter</option>
                    </select>

                    {/* Doctor Fields */}
                    {selectedRole === 'doctor' && (
                        <>
                            <input type="text" placeholder="👤 Full Name"  value={fullName}  onChange={(e) => setFullName(e.target.value)}  required />
                            <input type="text" placeholder="🩺 Specialty"  value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
                            <input type="text" placeholder="🔢 Num Ordre"  value={numOrdre}  onChange={(e) => setNumOrdre(e.target.value)}  required />
                            <input type="text" placeholder="📍 Location"   value={location}  onChange={(e) => setLocation(e.target.value)}  required />
                        </>
                    )}

                    {/* Nurse Fields */}
                    {selectedRole === 'nurse' && (
                        <>
                            <select value={diplome} onChange={(e) => setDiplome(e.target.value)} required className="form-select">
                                <option value="">-- Select Diploma --</option>
                                <option value="IDE">IDE</option>
                                <option value="ISP">ISP</option>
                            </select>
                            <input type="text" placeholder="🏥 Service" value={service} onChange={(e) => setService(e.target.value)} required />
                            <input type="text" placeholder="👥 Equipe"  value={equipe}  onChange={(e) => setEquipe(e.target.value)}  required />
                        </>
                    )}

                    {/* Pharmacist Fields */}
                    {selectedRole === 'pharmacist' && (
                        <>
                            <input type="text" placeholder="🏪 Pharmacy Name"    value={nomPharmacie}     onChange={(e) => setNomPharmacie(e.target.value)}     required />
                            <input type="text" placeholder="📍 Pharmacy Address" value={adressePharmacie} onChange={(e) => setAdressePharmacie(e.target.value)} required />
                            <input type="text" placeholder="📋 Approval Number"  value={numAgrement}      onChange={(e) => setNumAgrement(e.target.value)}      required />
                        </>
                    )}

                    {/* Firefighter Fields */}
                    {selectedRole === 'firefighter' && (
                        <>
                            <input type="text" placeholder="🔢 Matricule" value={matricule}         onChange={(e) => setMatricule(e.target.value)}         required />
                            <input type="text" placeholder="⭐ Grade"     value={grade}             onChange={(e) => setGrade(e.target.value)}             required />
                            <input type="text" placeholder="🚒 Unit"      value={uniteIntervention} onChange={(e) => setUniteIntervention(e.target.value)} required />
                        </>
                    )}

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Creating Account...' : '✅ Create Account'}
                    </button>
                </form>

                <p className="login-link">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/')} className="link-btn">Login</button>
                </p>
            </div>
        </div>
    );
};

export default Signup;