import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Removed useWindowSize hook, handled by CSS
    const { customerName, totalPrice, cart = [], details = {} } = location.state || {};

    useEffect(() => {
        // Αυτόματη κύλιση στην κορυφή για να φαίνεται το "τικ" επιτυχίας
        window.scrollTo(0, 0);

        if (!location.state) {
            navigate('/', { replace: true });
            return;
        }

        // Play confirmation sound
        try {
            const audio = new Audio('/sounds/confirm.mp3');
            audio.play().catch(error => console.log('Audio playback failed:', error));
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    }, [location.state, navigate]);

    if (!location.state) return null;

    return (
        <div className="order-success-root">
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={200}
                recycle={false}
                colors={['#007aff', '#34c759', '#ff9500', '#ff3b30']}
            />

            <div className="premium-card animate-fade-in success-card">
                {/* Success Animation Container */}
                <div className="success-header-mb">
                    <div className="success-checkmark-wrapper">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                <h1 className="success-title">
                    Ευχαριστούμε, {customerName}!
                </h1>

                <p className="success-subtitle">
                    Η παραγγελία σου καταχωρήθηκε.<br />
                    Θα την έχουμε έτοιμη σύντομα!
                </p>

                {/* Order Details Sections */}
                <div className="order-details-container">
                    {/* Products List */}
                    <div className="details-section-mb">
                        <h3 className="section-label">Προϊόντα</h3>
                        <div className="items-list">
                            {cart.map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <span className="item-qty-name">{item.quantity}x {item.name}</span>
                                    <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="delivery-info-box">
                        <h3 className="section-label">Στοιχεία Παράδοσης</h3>
                        <div className="delivery-details-list">
                            <div className="detail-row">
                                <span className="detail-label">Τηλέφωνο:</span>
                                <span className="detail-value">{details.phone}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Διεύθυνση:</span>
                                <span className="detail-value">{details.address}</span>
                            </div>
                            <div className="detail-row-responsive">
                                {details.bell && (
                                    <div className="detail-sub-group">
                                        <span className="detail-label">Κουδούνι:</span>
                                        <span className="detail-value-break">{details.bell}</span>
                                    </div>
                                )}
                                {details.floor && (
                                    <div className="detail-sub-group">
                                        <span className="detail-label">Όροφος:</span>
                                        <span className="detail-value">{details.floor}</span>
                                    </div>
                                )}
                            </div>
                            {details.comments && (
                                <div className="comment-row">
                                    <span className="detail-label">Σχόλια:</span>
                                    <span className="comment-text">{details.comments}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="total-section">
                    <span className="total-label">Σύνολο:</span>
                    <span className="total-amount">
                        €{totalPrice.toFixed(2)}
                    </span>
                </div>

                <button
                    className="add-btn return-btn"
                    onClick={() => navigate('/', { replace: true })}
                >
                    Επιστροφή στο Μενού
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
