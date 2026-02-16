import React from 'react';

const OrderCard = ({ order }) => {
    const statusMapping = {
        pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
        preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
        ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
        delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
        delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' }
    };

    const currentStatus = statusMapping[order.status] || { label: order.status, color: 'var(--text-muted)' };

    return (
        <div className="premium-card order-card">
            <div className="card-header">
                <span className="order-id">ΠΑΡΑΓΓΕΛΙΑ #{order.id}</span>
                <span className="status-label" style={{
                    backgroundColor: `${currentStatus.color}15`,
                    color: currentStatus.color,
                    border: `1px solid ${currentStatus.color}30`
                }}>
                    {currentStatus.label}
                </span>
            </div>

            <div className="order-items">
                {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                        <span className="item-name">{item.quantity}x {item.name}</span>
                        <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="card-footer">
                <span className="time-stamp">{order.timestamp}</span>
                <span className="total-price">€{order.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderCard;
