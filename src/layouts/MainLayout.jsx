import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="app-container">
            {/* Top Navigation Bar */}
            <nav className="glass app-nav">
                <div className="nav-logo">
                    <h2>Order Manager</h2>
                </div>
                <div className="nav-actions">
                    <div className="glass profile-badge">
                        ΠΡΟΦΙΛ ΔΙΑΧΕΙΡΙΣΤΗ
                    </div>
                    <button className="premium-card logout-btn">
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
