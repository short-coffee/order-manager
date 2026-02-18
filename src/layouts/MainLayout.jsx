import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const fetchShopStatus = async () => {
        try {
            const status = await api.getShopStatus();
            setIsOpen(status);
        } catch (error) {
            console.error('Error fetching shop status:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmToggleShop = async () => {
        try {
            const newStatus = !isOpen;
            await api.toggleShopStatus(newStatus);
            setIsOpen(newStatus);
            setShowStatusModal(false);
        } catch (error) {
            console.error('Error toggling shop status:', error);
            alert('Σφάλμα κατά την ενημέρωση.');
        }
    };

    useEffect(() => {
        fetchShopStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(); // AuthContext handles session clearing
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const renderStatusModal = () => {
        if (!showStatusModal) return null;

        return (
            <div className="confirm-overlay" onClick={() => setShowStatusModal(false)}>
                <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
                    <div className="confirm-icon">{isOpen ? '🛑' : '✅'}</div>
                    <h3>{isOpen ? 'Κλείσιμο Καταστήματος;' : 'Άνοιγμα Καταστήματος;'}</h3>
                    <p>
                        {isOpen
                            ? 'Θέλετε σίγουρα να απενεργοποιήσετε τις παραγγελίες; Οι πελάτες δεν θα μπορούν να παραγγείλουν.'
                            : 'Θέλετε να ενεργοποιήσετε τις παραγγελίες; Το κατάστημα θα είναι ξανά διαθέσιμο για τους πελάτες.'}
                    </p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={() => setShowStatusModal(false)}>ΑΚΥΡΟ</button>
                        <button
                            className={`btn-confirm ${isOpen ? 'danger' : ''}`}
                            onClick={confirmToggleShop}
                        >
                            {isOpen ? 'ΚΛΕΙΣΙΜΟ' : 'ΑΝΟΙΓΜΑ'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            {renderStatusModal()}
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
                    {/* Status Toggle Button */}
                    {!loading && (
                        <div className="shop-status-btn" onClick={() => setShowStatusModal(true)}>
                            <div className={`status-indicator ${isOpen ? 'open' : 'closed'}`}></div>
                            <span className="status-label">
                                {isOpen ? 'OPEN' : 'CLOSED'}
                            </span>
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

export default MainLayout;