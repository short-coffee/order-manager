import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MenuGrid from '../features/ordering/components/MenuGrid';
import CartDrawer from '../features/ordering/components/CartDrawer';

const CATEGORY_MAPPING = {
    'coffee': 'Καφέδες',
    'chocolate': 'Σοκολάτες',
    'tea': 'Τσάι',
    'snacks': 'Σνακ',
    'food': 'Φαγητό',
    'desserts': 'Γλυκά/Παγωτά',
    'ice-tea': 'Ice Tea',
    'granites': 'Γρανίτες',
    'smoothies': 'Smoothies',
    'soft-drinks': 'Αναψυκτικά',
    'beer': 'Μπύρες',
    'wine': 'Κρασιά',
    'drinks': 'Ποτά'
};

const OrderPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('Όλα');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories = ['Όλα', ...new Set(products.map(item => item.category))];

    const filteredItems = selectedCategory === 'Όλα'
        ? products
        : products.filter(item => item.category === selectedCategory);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => {
            const updated = prev.map(i =>
                i.id === id ? { ...i, quantity: i.quantity + delta } : i
            ).filter(i => i.quantity > 0);

            // Close cart if it becomes empty
            if (updated.length === 0) setIsCartOpen(false);

            return updated;
        });
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) {
        return (
            <div className="order-page-root">
                <main className="order-main" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
                    <div className="loading-spinner">Φόρτωση Μενού...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="order-page-root">
            {/* Consumer Header */}
            <header className="customer-header glass">
                <div className="header-content">
                    <div className="logo-container animate-fade-in">
                        <div className="logo-circle">
                            <img
                                src="logo.png"
                                alt="Shop Logo"
                                className="logo-img"
                            />
                        </div>
                    </div>
                    <h1>Menu</h1>
                    <p>Premium Coffee & Snacks</p>
                </div>
            </header>

            {/* Category Scroll */}
            <div className="category-bar-wrapper">
                <div className="category-bar animate-slide-in">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {CATEGORY_MAPPING[cat] || cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            <main className="order-main">
                <MenuGrid
                    items={filteredItems.map(item => ({
                        ...item,
                        image: item.image_url // Mapping DB field to component prop
                    }))}
                    onAdd={addToCart}
                />
                {filteredItems.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία.
                    </p>
                )}
            </main>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="cart-floating-action animate-bounce-in">
                    <button className="cart-summary-btn premium-card" onClick={() => setIsCartOpen(true)}>
                        <div className="cart-info">
                            <div className="cart-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43a1 1 0 0 0-1-1.21H6.05" /></svg>
                                <span className="cart-count">{totalItems}</span>
                            </div>
                            <span className="cart-label">Καλάθι</span>
                        </div>
                        <span className="cart-total">€{totalPrice.toFixed(2)}</span>
                    </button>
                </div>
            )}

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <CartDrawer
                    cart={cart}
                    onClose={() => setIsCartOpen(false)}
                    onRemove={removeFromCart}
                    onUpdate={updateQuantity}
                    totalPrice={totalPrice}
                    onCheckout={() => navigate('/checkout', { state: { cart, totalPrice } })}
                />
            )}
        </div>
    );
};

export default OrderPage;
