import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

const OrderCard = ({ order }) => {
    const [updating, setUpdating] = useState(false);

    const statusMapping = {
        pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
        preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
        ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
        delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
        delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' }
    };

    const currentStatus = statusMapping[order.status] || { label: order.status, color: 'var(--text-muted)' };

    // Support both mock data and Supabase data
    const items = order.order_items || order.items || [];
    const totalPrice = order.total_price || order.total || 0;

    // Format timestamp
    let displayTime = order.timestamp;
    if (order.created_at) {
        const date = new Date(order.created_at);
        displayTime = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
    }

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Σφάλμα κατά την ενημέρωση της κατάστασης.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="premium-card order-card">
            <div className="card-header">
                <span className="order-id">ΠΑΡΑΓΓΕΛΙΑ #{order.id.toString().slice(-4).toUpperCase()}</span>
                <span className="status-label" style={{
                    backgroundColor: `${currentStatus.color}15`,
                    color: currentStatus.color,
                    border: `1px solid ${currentStatus.color}30`
                }}>
                    {currentStatus.label}
                </span>
            </div>

            <div className="order-items">
                {items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                        <span className="item-name">{item.quantity}x {item.product_name || item.name}</span>
                        <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="card-footer">
                <div className="card-footer-info">
                    <span className="time-stamp">{displayTime}</span>
                    <span className="total-price">€{totalPrice.toFixed(2)}</span>
                </div>

                <div className="card-actions">
                    {['pending', 'preparing', 'ready'].includes(order.status) && (
                        <button
                            className="action-btn send-btn"
                            onClick={() => updateStatus('delivering')}
                            disabled={updating}
                        >
                            {updating ? '...' : 'ΑΠΟΣΤΟΛΗ'}
                        </button>
                    )}
                    {order.status === 'delivering' && (
                        <button
                            className="action-btn complete-btn"
                            onClick={() => updateStatus('delivered')}
                            disabled={updating}
                        >
                            {updating ? '...' : 'ΟΛΟΚΛΗΡΩΣΗ'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
