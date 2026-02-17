import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
        const subscription = supabase
            .channel('checkout-status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'settings',
                filter: 'key=eq.is_ordering_enabled'
            }, (payload) => {
                if (payload.new.value === false) {
                    navigate('/', { replace: true });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
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
            const { data: statusData } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'is_ordering_enabled')
                .single();

            if (statusData && statusData.value === false) {
                setError('Λυπούμαστε, το κατάστημα μόλις έκλεισε. Η παραγγελία δεν μπορεί να ολοκληρωθεί.');
                setTimeout(() => navigate('/'), 3000);
                setLoading(false);
                return;
            }

            // 1. Insert the order header
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: formData.name,
                        customer_phone: formData.phone,
                        customer_address: formData.address,
                        bell: formData.bell,
                        floor: formData.floor,
                        comments: formData.comments,
                        total_price: totalPrice,
                        status: 'pending'
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert the order items
            const orderItems = cart.map(item => ({
                order_id: orderData.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

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
                <main className="order-main" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <h2>Το καλάθι σας είναι άδειο</h2>
                    <button className="add-btn" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
                        Επιστροφή στο Μενού
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="order-page-root">
            <header className="customer-header glass">
                <div className="header-content">
                    <h1>Ολοκλήρωση Παραγγελίας</h1>
                    <p>Συμπληρώστε τα στοιχεία σας για την παράδοση</p>
                </div>
            </header>

            <main className="checkout-container animate-fade-in">
                {/* Summary Section - Now First */}
                <aside className="checkout-section summary-aside">
                    <h2>Σύνοψη Παραγγελίας</h2>
                    <div className="summary-items">
                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="summary-item-name">
                                    {item.quantity}x {item.name}
                                </div>
                                <div className="summary-item-price">
                                    €{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span className="total-label">Σύνολο:</span>
                        <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        className="add-btn"
                        onClick={() => navigate('/')}
                        style={{ marginTop: '2rem', border: '1px solid #eee' }}
                        disabled={loading}
                    >
                        ← Προσθήκη περισσότερων
                    </button>
                </aside>

                {/* Form Section - Now Second */}
                <section className="checkout-section">
                    <h2>Στοιχεία Παράδοσης</h2>
                    {error && <div className="error-msg" style={{ marginBottom: '1.5rem' }}>{error}</div>}
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
