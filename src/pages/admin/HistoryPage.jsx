import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { supabase } from '../../lib/supabase';
import './HistoryPage.css';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState({ revenue: 0, count: 0, average: 0 });

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [selectedDate]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Δημιουργία εύρους ημερομηνίας (από 00:00:00 έως 23:59:59)
            const startOfDay = `${selectedDate}T00:00:00.000Z`;
            const endOfDay = `${selectedDate}T23:59:59.999Z`;

            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .in('status', ['delivered', 'archived'])
                .gte('created_at', startOfDay)
                .lte('created_at', endOfDay)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orderList) => {
        const revenue = orderList.reduce((sum, o) => sum + (o.total_price || 0), 0);
        const count = orderList.length;
        const average = count > 0 ? revenue / count : 0;
        setStats({ revenue, count, average });
    };

    const renderModal = () => {
        if (!selectedOrder) return null;

        const items = selectedOrder.order_items || [];
        const totalPrice = selectedOrder.total_price || 0;
        const displayTime = new Date(selectedOrder.created_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="modal-overlay details-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="confirm-modal details-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title-group">
                            <h3>Λεπτομέρειες Παραγγελίας</h3>
                            <span className="modal-status" style={{ color: 'var(--text-muted)' }}>
                                {selectedOrder.status === 'delivered' ? 'ΟΛΟΚΛΗΡΩΜΕΝΗ' : 'ΑΡΧΕΙΟΘΕΤΗΜΕΝΗ'}
                            </span>
                        </div>
                        <button className="modal-close-icon" onClick={() => setSelectedOrder(null)}>×</button>
                    </div>

                    <div className="modal-scroll-body">
                        <div className="modal-section" style={{ marginBottom: '1.5rem' }}>
                            <span className="modal-time" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {displayTime} • {new Date(selectedOrder.created_at).toLocaleDateString('el-GR')}
                            </span>
                        </div>

                        <div className="modal-section">
                            <span className="section-label">ΠΡΟΪΟΝΤΑ</span>
                            <div className="modal-items-list">
                                {items.map((item, idx) => (
                                    <div key={idx} className="modal-item-row">
                                        <div className="item-qty-name">
                                            <span className="qty">{item.quantity}x</span>
                                            <div className="name-options">
                                                <span className="name">{item.product_name || item.name}</span>
                                                {item.options && (
                                                    <div className="options">
                                                        {item.options.sugar && <span>• {
                                                            item.options.sugar === 'none' ? 'Σκέτος' :
                                                                item.options.sugar === 'medium' ? 'Μέτριος' :
                                                                    item.options.sugar === 'sweet' ? 'Γλυκός' :
                                                                        item.options.sugar === 'little' ? 'Με ολίγη' :
                                                                            item.options.sugar === 'saccharin' ? 'Ζαχαρίνη' :
                                                                                item.options.sugar === 'stevia' ? 'Στέβια' :
                                                                                    item.options.sugar === 'brown' ? 'Μαύρη' : item.options.sugar
                                                        }</span>}
                                                        {item.options.decaf && <span>• Decaf</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="price">€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-section-grid">
                            <div className="modal-section">
                                <span className="section-label">ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ</span>
                                <div className="customer-detail"><b>Ονομα:</b> {selectedOrder.customer_name}</div>
                                <div className="customer-detail"><b>Τηλ:</b> {selectedOrder.customer_phone}</div>
                                <div className="customer-detail"><b>Διεύθυνση:</b> {selectedOrder.customer_address}</div>
                            </div>
                            <div className="modal-section">
                                <span className="section-label">ΤΟΠΟΘΕΣΙΑ</span>
                                <div className="customer-detail"><b>Κουδούνι:</b> {selectedOrder.bell || '-'}</div>
                                <div className="customer-detail"><b>Όροφος:</b> {selectedOrder.floor || '-'}</div>
                            </div>
                        </div>

                        {selectedOrder.comments && (
                            <div className="modal-section">
                                <span className="section-label">ΣΧΟΛΙΑ</span>
                                <div className="modal-comments-box">{selectedOrder.comments}</div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer-price">
                        <span className="total-label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</span>
                        <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="history-container animate-fade-in">
                {renderModal()}
                <header className="history-header">
                    <div className="header-left">
                        <h1>Ιστορικό Παραγγελιών</h1>
                        <p className="subtitle">Επισκόπηση ολοκληρωμένων παραγγελιών και στατιστικά</p>
                    </div>
                    <div className="date-picker-wrapper">
                        <label>Ημερομηνία</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="premium-date-input"
                        />
                    </div>
                </header>

                <div className="history-stats-grid">
                    <div className="premium-card stat-card">
                        <span className="stat-label">ΣΥΝΟΛΙΚΑ ΕΣΟΔΑ</span>
                        <span className="stat-value">€{stats.revenue.toFixed(2)}</span>
                        <div className="stat-icon revenue-icon">€</div>
                    </div>
                    <div className="premium-card stat-card">
                        <span className="stat-label">ΠΛΗΘΟΣ ΠΑΡΑΓΓΕΛΙΩΝ</span>
                        <span className="stat-value">{stats.count}</span>
                        <div className="stat-icon count-icon">📦</div>
                    </div>
                    <div className="premium-card stat-card">
                        <span className="stat-label">ΜΕΣΗ ΠΑΡΑΓΓΕΛΙΑ</span>
                        <span className="stat-value">€{stats.average.toFixed(2)}</span>
                        <div className="stat-icon avg-icon">📊</div>
                    </div>
                </div>

                <div className="premium-card history-table-card">
                    {loading ? (
                        <div className="loading-state">Φόρτωση δεδομένων...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">Δεν βρέθηκαν παραγγελίες για αυτή την ημερομηνία.</div>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ΩΡΑ</th>
                                    <th>ΠΕΛΑΤΗΣ</th>
                                    <th>ΠΡΟΪΟΝΤΑ</th>
                                    <th>ΣΥΝΟΛΟ</th>
                                    <th className="actions-header">ΕΝΕΡΓΕΙΕΣ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="order-id-cell">#{order.id.toString().slice(-4).toUpperCase()}</td>
                                        <td>{new Date(order.created_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <div className="customer-cell">
                                                <span className="customer-name">{order.customer_name}</span>
                                                <span className="customer-phone">{order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="items-tags">
                                                {order.order_items?.map((item, idx) => (
                                                    <span key={idx} className="item-tag">
                                                        {item.quantity}x {item.product_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="price-cell">€{order.total_price.toFixed(2)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="history-details-btn"
                                                onClick={() => setSelectedOrder(order)}
                                                title="Λεπτομέρειες"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default HistoryPage;