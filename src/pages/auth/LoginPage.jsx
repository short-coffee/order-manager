import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate('/dashboard');
        } catch (err) {
            setError('Λάθος email ή κωδικός πρόσβασης.');
            console.error('Login error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated Background Elements */}
            <div className="bg-animations">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="premium-card login-card animate-fade-in">
                <div className="logo-container">
                    <div className="logo-circle" style={{ margin: '0 auto 1.5rem' }}>
                        <img src="/logo.png" alt="Logo" className="logo-img" />
                    </div>
                </div>
                <h2>Admin Login</h2>
                <p>Σύνδεση στο σύστημα διαχείρισης παραγγελιών</p>

                {error && <div className="error-msg">{error}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Κωδικός Πρόσβασης</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Σύνδεση...' : 'Είσοδος'}
                        {!loading && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
