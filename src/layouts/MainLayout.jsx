import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShopStatus();
    }, []);

    const fetchShopStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'is_ordering_enabled')
                .single();

            if (error) throw error;
            if (data) setIsOpen(data.value);
        } catch (error) {
            console.error('Error fetching shop status:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleShop = async () => {
        const newStatus = !isOpen;
        setIsOpen(newStatus); // Optimistic update
        try {
            const { error } = await supabase
                .from('settings')
                .update({ value: newStatus })
                .eq('key', 'is_ordering_enabled');

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling shop status:', error);
            setIsOpen(!newStatus); // Revert on error
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    return (
        <div className="app-container">
            {/* Top Navigation Bar */}
            <nav className="glass app-nav">
                <div className="nav-logo">
                    <img src="/favicon.png" alt="Black Bear Logo" className="dashboard-logo" />
                    <h2 className="brand-name">BLACK BEAR</h2>
                </div>

                <div className="nav-links">
                    <button
                        className={`nav-link-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        LIVE ORDERS
                    </button>
                    <button
                        className={`nav-link-btn ${location.pathname === '/dashboard/history' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard/history')}
                    >
                        ΙΣΤΟΡΙΚΟ
                    </button>
                </div>
                <div className="nav-actions">
                    {/* Status Toggle */}
                    {!loading && (
                        <div className="shop-status-toggle">
                            <span className={`status-text ${isOpen ? 'open' : 'closed'}`}>
                                {isOpen ? 'ΚΑΤΑΣΤΗΜΑ ΑΝΟΙΧΤΟ' : 'ΚΑΤΑΣΤΗΜΑ ΚΛΕΙΣΤΟ'}
                            </span>
                            <label className="switch">
                                <input type="checkbox" checked={isOpen} onChange={toggleShop} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    )}
                    <div className="glass profile-badge">
                        ΠΡΟΦΙΛ ΔΙΑΧΕΙΡΙΣΤΗ
                    </div>
                    <button className="premium-card logout-btn" onClick={handleLogout}>
                        ΑΠΟΣΥΝΔΕΣΗ
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="main-content">
                <section className="animate-fade-in content-container">
                    {children}
                </section>
            </main>
        </div>
    );
};

const navItemStyle = {
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    color: 'var(--text-muted)'
};

const navActiveItemStyle = {
    ...navItemStyle,
    color: 'var(--primary)',
    fontWeight: '700',
    backgroundColor: 'var(--bg-light)',
    borderBottom: '2px solid var(--primary)',
    borderRadius: '0'
};

export default MainLayout;
