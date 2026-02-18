import React from 'react';
import { STATUS_MAPPING } from '../../../lib/constants';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const currentStatus = STATUS_MAPPING[order.status] || { label: order.status, color: 'var(--text-muted)' };
    const items = order.order_items || [];
    const totalPrice = order.total_price || 0;
    const displayTime = new Date(order.created_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="modal-overlay details-overlay" onClick={onClose}>
            <div className="confirm-modal details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        <h3>Λεπτομέρειες Παραγγελίας</h3>
                        <span className="modal-status" style={{ color: currentStatus.color }}>
                            {currentStatus.label}
                        </span>
                    </div>
                    <button className="modal-close-icon" onClick={onClose}>×</button>
                </div>

                <div className="modal-scroll-body">
                    <div className="modal-section">
                        <span className="modal-time">
                            {displayTime} • {new Date(order.created_at).toLocaleDateString('el-GR')}
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
                            <div className="customer-detail"><b>Ονομα:</b> {order.customer_name}</div>
                            <div className="customer-detail"><b>Τηλ:</b> {order.customer_phone}</div>
                            <div className="customer-detail"><b>Διεύθυνση:</b> {order.customer_address}</div>
                        </div>
                        <div className="modal-section">
                            <span className="section-label">ΤΟΠΟΘΕΣΙΑ</span>
                            <div className="customer-detail"><b>Κουδούνι:</b> {order.bell || '-'}</div>
                            <div className="customer-detail"><b>Όροφος:</b> {order.floor || '-'}</div>
                        </div>
                    </div>

                    {order.comments && (
                        <div className="modal-section">
                            <span className="section-label">ΣΧΟΛΙΑ</span>
                            <div className="modal-comments-box">{order.comments}</div>
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

export default OrderDetailsModal;
