import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import './CheckoutPage.css';
import './OrderPage.css'; // Inherits ordering layout

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart = [], totalPrice = 0 } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        bell: '',
        floor: '',
        comments: ''
    });

    useEffect(() => {
        // Guard: Αν δεν υπάρχει καλάθι
        if (cart.length === 0) {
            navigate('/');
            return;
        }

        // Real-time Shop Status Check
        const unsubscribe = api.subscribeToShopStatus((isOpen) => {
            if (!isOpen) {
                navigate('/', { replace: true });
            }
        });

        return () => {
            unsubscribe();
        };
    }, [cart, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 0. Double check if ordering is still enabled
            const isShopOpen = await api.getShopStatus();

            if (!isShopOpen) {
                setError('Λυπούμαστε, το κατάστημα μόλις έκλεισε. Η παραγγελία δεν μπορεί να ολοκληρωθεί.');
                setTimeout(() => navigate('/'), 3000);
                setLoading(false);
                return;
            }

            // 1. Prepare Order Data
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                bell: formData.bell,
                floor: formData.floor,
                comments: formData.comments,
                total_price: totalPrice,
                status: 'pending'
            };

            // 2. Submit Order via API
            await api.submitOrder(orderData, cart);

            localStorage.removeItem('cart');

            navigate('/order-success', {
                state: {
                    customerName: formData.name,
                    totalPrice: totalPrice,
                    cart: cart,
                    details: formData
                },
                replace: true
            });
        } catch (error) {
            console.error('Error submitting order:', error);
            setError('Παρουσιάστηκε σφάλμα κατά την καταχώρηση της παραγγελίας. Παρακαλούμε δοκιμάστε ξανά.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="order-page-root">
                <main className="order-main empty-cart-container">
                    <h2>Το καλάθι σας είναι άδειο</h2>
                    <button className="add-btn empty-cart-btn" onClick={() => navigate('/')}>
                        Επιστροφή στο Μενού
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="order-page-root">
            <header className="customer-header glass">
                <div className="header-container">
                    <img src="/images/logo.png" alt="Black Bear Logo" className="minimal-logo" />
                    <div className="header-text">
                        <h1>Ολοκλήρωση Παραγγελίας</h1>
                        <p>Συμπληρώστε τα στοιχεία σας για την παράδοση</p>
                    </div>
                </div>
            </header>

            <main className="checkout-container animate-fade-in">
                {/* Summary Section - Now First */}
                <aside className="checkout-section summary-aside">
                    <h2>Σύνοψη Παραγγελίας</h2>
                    <div className="summary-items">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="summary-item">
                                <div className="summary-item-header">
                                    <div className="summary-item-name">
                                        {item.quantity}x {item.name}
                                    </div>
                                    <div className="summary-item-price">
                                        €{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                                {item.options && (
                                    <div className="summary-item-options">
                                        {item.options.sugar === 'none' ? 'ΣΚΕΤΟΣ' :
                                            item.options.sugar === 'medium' ? 'ΜΕΤΡΙΟΣ' :
                                                item.options.sugar === 'sweet' ? 'ΓΛΥΚΟΣ' :
                                                    item.options.sugar === 'little' ? 'ΜΕ ΟΛΙΓΗ' :
                                                        item.options.sugar === 'saccharin' ? 'ΖΑΧΑΡΙΝΗ' :
                                                            item.options.sugar === 'stevia' ? 'ΣΤΕΒΙΑ' :
                                                                item.options.sugar === 'brown' ? 'ΜΑΥΡΗ Z.' : ''}
                                        {item.options.decaf ? ' • Decaf' : ''}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span className="total-label">Σύνολο:</span>
                        <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        className="add-btn add-btn-secondary"
                        onClick={() => navigate('/')}
                        disabled={loading}
                    >
                        ← Προσθήκη περισσότερων
                    </button>
                </aside>

                {/* Form Section - Now Second */}
                <section className="checkout-section">
                    <h2>Στοιχεία Παράδοσης</h2>
                    {error && <div className="error-msg error-msg-container">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Ονοματεπώνυμο</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="π.χ. Γιάννης"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Τηλέφωνο</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    placeholder="69XXXXXXXX"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Διεύθυνση</label>
                            <input
                                type="text"
                                name="address"
                                required
                                placeholder="Οδός, Αριθμός, Περιοχή"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Κουδούνι</label>
                                <input
                                    type="text"
                                    name="bell"
                                    placeholder="Όνομα στο κουδούνι"
                                    value={formData.bell}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Όροφος</label>
                                <input
                                    type="text"
                                    name="floor"
                                    placeholder="π.χ. 1ος"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Σχόλια (Προαιρετικά)</label>
                            <textarea
                                name="comments"
                                rows="2"
                                placeholder="..."
                                value={formData.comments}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`order-confirm-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'ΚΑΤΑΧΩΡΗΣΗ...' : 'ΕΠΙΒΕΒΑΙΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default CheckoutPage;
