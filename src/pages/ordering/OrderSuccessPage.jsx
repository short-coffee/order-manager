import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { width, height } = useWindowSize();
    const { customerName, totalPrice, cart = [], details = {} } = location.state || {};

    useEffect(() => {
        // Αυτόματη κύλιση στην κορυφή για να φαίνεται το "τικ" επιτυχίας
        window.scrollTo(0, 0);

        if (!location.state) {
            navigate('/', { replace: true });
        }
    }, [location.state, navigate]);

    if (!location.state) return null;

    return (
        <div className="order-page-root" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9f9f9',
            padding: '2rem 1rem'
        }}>
            <Confetti
                width={width}
                height={height}
                numberOfPieces={200}
                recycle={false}
                colors={['#007aff', '#34c759', '#ff9500', '#ff3b30']}
            />

            <div className="premium-card animate-fade-in" style={{
                maxWidth: '600px',
                width: '100%',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                borderRadius: '32px',
                background: '#fff',
                border: '1px solid #eee'
            }}>
                {/* Success Animation Container */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div className="success-checkmark-wrapper">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    marginBottom: '0.8rem',
                    color: '#1d1d1f',
                    letterSpacing: '-1px'
                }}>
                    Ευχαριστούμε, {customerName}!
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#86868b',
                    marginBottom: '2rem',
                    lineHeight: '1.5',
                    fontWeight: '500'
                }}>
                    Η παραγγελία σου καταχωρήθηκε.<br />
                    Θα την έχουμε έτοιμη σύντομα!
                </p>

                {/* Order Details Sections */}
                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    {/* Products List */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Προϊόντα</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#1d1d1f' }}>
                                    <span style={{ fontWeight: '600' }}>{item.quantity}x {item.name}</span>
                                    <span style={{ fontWeight: '500' }}>€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div style={{ background: '#f5f5f7', padding: '1.5rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Στοιχεία Παράδοσης</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: '#86868b' }}>Τηλέφωνο:</span>
                                <span style={{ fontWeight: '700' }}>{details.phone}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: '#86868b' }}>Διεύθυνση:</span>
                                <span style={{ fontWeight: '700' }}>{details.address}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {details.bell && (
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <span style={{ color: '#86868b' }}>Κουδούνι:</span>
                                        <span style={{ fontWeight: '700' }}>{details.bell}</span>
                                    </div>
                                )}
                                {details.floor && (
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <span style={{ color: '#86868b' }}>Όροφος:</span>
                                        <span style={{ fontWeight: '700' }}>{details.floor}</span>
                                    </div>
                                )}
                            </div>
                            {details.comments && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <span style={{ color: '#86868b' }}>Σχόλια:</span>
                                    <span style={{ fontStyle: 'italic' }}>{details.comments}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #eee',
                    paddingTop: '1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: '800', color: '#1d1d1f', fontSize: '1.1rem' }}>Σύνολο:</span>
                    <span style={{ fontWeight: '900', color: '#007aff', fontSize: '1.8rem' }}>
                        €{totalPrice.toFixed(2)}
                    </span>
                </div>

                <button
                    className="add-btn"
                    onClick={() => navigate('/', { replace: true })}
                    style={{
                        background: '#000',
                        color: '#fff',
                        padding: '1.2rem',
                        fontSize: '1.1rem',
                        borderRadius: '18px',
                        width: '100%',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    Επιστροφή στο Μενού
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
