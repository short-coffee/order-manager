import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import MenuGrid from '../../features/ordering/components/MenuGrid';
import CartDrawer from '../../features/ordering/components/CartDrawer';
import CustomizationModal from '../../features/ordering/components/CustomizationModal';
import './OrderPage.css';

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
    const [selectedCategory, setSelectedCategory] = useState('coffee');
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [customizingProduct, setCustomizingProduct] = useState(null);
    const categoryBarRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const categoryBar = categoryBarRef.current;
        if (!categoryBar) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                categoryBar.scrollLeft += e.deltaY;
            }
        };

        categoryBar.addEventListener('wheel', handleWheel, { passive: false });
        return () => categoryBar.removeEventListener('wheel', handleWheel);
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - categoryBarRef.current.offsetLeft);
        setScrollLeft(categoryBarRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - categoryBarRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast factor
        categoryBarRef.current.scrollLeft = scrollLeft - walk;
    };

    const fetchInitialData = async () => {
        try {
            // 1. Fetch Products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (productsError) throw productsError;
            setProducts(productsData || []);

            // 2. Fetch Shop Status
            const { data: settingsData, error: settingsError } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'is_ordering_enabled')
                .single();

            if (settingsError) throw settingsError;
            if (settingsData) setIsShopOpen(settingsData.value);

        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();

        // 3. Real-time Shop Status Subscription
        const subscription = supabase
            .channel('shop-status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'settings',
                filter: 'key=eq.is_ordering_enabled'
            }, (payload) => {
                setIsShopOpen(payload.new.value);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const categories = [...new Set(products.map(item => item.category))].sort((a, b) => {
        const order = [
            'coffee', 'chocolate', 'tea', 'ice-tea', 'granites',
            'smoothies', 'soft-drinks', 'beer', 'wine', 'drinks',
            'snacks', 'desserts', 'food'
        ];
        const idxA = order.indexOf(a);
        const idxB = order.indexOf(b);

        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    const filteredItems = products.filter(item => item.category === selectedCategory);

    const addToCart = (item, options = null) => {
        if (!isShopOpen) return;

        // Check if item needs customization (only coffee for now)
        const needsCustomization = item.category === 'coffee';

        if (needsCustomization && !options) {
            setCustomizingProduct(item);
            return;
        }

        setCart(prev => {
            // Uniqueness is defined by ID + Options (stringified for easy comparison)
            const optionsKey = JSON.stringify(options);
            const existingIndex = prev.findIndex(i =>
                i.id === item.id && JSON.stringify(i.options) === optionsKey
            );

            if (existingIndex !== -1) {
                const updatedCart = [...prev];
                updatedCart[existingIndex] = {
                    ...updatedCart[existingIndex],
                    quantity: updatedCart[existingIndex].quantity + 1
                };
                return updatedCart;
            }
            return [...prev, { ...item, quantity: 1, options }];
        });
        setCustomizingProduct(null);
    };

    const removeFromCart = (id, options = null) => {
        const optionsKey = JSON.stringify(options);
        setCart(prev => prev.filter(i =>
            !(i.id === id && JSON.stringify(i.options) === optionsKey)
        ));
    };

    const updateQuantity = (id, delta, options = null) => {
        const optionsKey = JSON.stringify(options);
        setCart(prev => {
            const updated = prev.map(i =>
                (i.id === id && JSON.stringify(i.options) === optionsKey)
                    ? { ...i, quantity: i.quantity + delta }
                    : i
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
            {/* Simple Minimal Header */}
            <header className="minimal-header">
                <div className="header-container animate-fade-in">
                    <img src="/logo.png" alt="Black Bear Logo" className="minimal-logo" />
                    <div className="header-text">
                        <h1>BLACK BEAR</h1>
                        <p>COFFEE BAR</p>
                    </div>
                </div>
            </header>

            {/* Category Scroll */}
            <div className="category-bar-wrapper">
                <div
                    className={`category-bar animate-slide-in ${isDragging ? 'dragging' : ''}`}
                    ref={categoryBarRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
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

            {/* Shop Closed Overlay */}
            {!isShopOpen && (
                <div className="shop-closed-overlay animate-fade-in">
                    <div className="closed-content premium-card">
                        <img src="/logo.png" alt="Black Bear Logo" className="closed-logo" />
                        <h2>Είμαστε Κλειστά</h2>
                        <p>Αυτή τη στιγμή δεν δεχόμαστε νέες παραγγελίες. <br /> Παρακαλούμε δοκιμάστε αργότερα!</p>
                        <div className="closed-hours">Σας ευχαριστούμε για την προτίμηση!</div>
                    </div>
                </div>
            )}

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
                    <button className="cart-summary-btn" onClick={() => setIsCartOpen(true)}>
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
                    onCheckout={() => {
                        if (!isShopOpen) return;
                        navigate('/checkout', { state: { cart, totalPrice } });
                    }}
                />
            )}

            {/* Customization Modal */}
            {customizingProduct && (
                <CustomizationModal
                    product={customizingProduct}
                    onClose={() => setCustomizingProduct(null)}
                    onConfirm={(options) => addToCart(customizingProduct, options)}
                />
            )}
        </div>
    );
};

export default OrderPage;
