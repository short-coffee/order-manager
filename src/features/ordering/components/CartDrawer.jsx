import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = ({ cart, onClose, onUpdate, onRemove, totalPrice, onCheckout }) => {
    const navigate = useNavigate();

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Το Καλάθι μου</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Το καλάθι σας είναι άδειο</p>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className="cart-item-title-row">
                                            <span className="cart-item-name">{item.name}</span>
                                            <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        {item.options && (
                                            <div className="cart-item-options">
                                                {item.options.sugar !== 'none' && (
                                                    <span className="option-tag">
                                                        {item.options.sugar === 'medium' ? 'ΜΕΤΡΙΟΣ' :
                                                            item.options.sugar === 'sweet' ? 'ΓΛΥΚΟΣ' :
                                                                item.options.sugar === 'little' ? 'ΜΕ ΟΛΙΓΗ' :
                                                                    item.options.sugar === 'saccharin' ? 'ΖΑΧΑΡΙΝΗ' :
                                                                        item.options.sugar === 'stevia' ? 'ΣΤΕΒΙΑ' :
                                                                            item.options.sugar === 'brown' ? 'ΜΑΥΡΗ' : item.options.sugar}
                                                    </span>
                                                )}
                                                {item.options.sugar === 'none' && <span className="option-tag">ΣΚΕΤΟΣ</span>}
                                                {item.options.decaf && <span className="option-tag decaf">Decaf</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="qty-controls">
                                            <button onClick={() => onUpdate(item.id, -1, item.options)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                            <span className="qty">{item.quantity}</span>
                                            <button onClick={() => onUpdate(item.id, 1, item.options)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                        </div>
                                        <button className="remove-btn" onClick={() => onRemove(item.id, item.options)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total-bar">
                        <span>Σύνολο:</span>
                        <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        disabled={cart.length === 0}
                        onClick={onCheckout}
                    >
                        ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
