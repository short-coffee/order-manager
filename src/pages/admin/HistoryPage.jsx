import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { supabase } from '../../lib/supabase';
import './HistoryPage.css';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState({ revenue: 0, count: 0, average: 0 });

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

    return (
        <MainLayout>
            <div className="history-container animate-fade-in">
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
