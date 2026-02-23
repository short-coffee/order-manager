import { useCart } from '../../hooks/useCart';
import { useDraggableScroll } from '../../hooks/useDraggableScroll';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CATEGORY_MAPPING, CATEGORY_ORDER, needsCustomization } from '../../lib/constants';
import MenuGrid from '../../features/ordering/components/MenuGrid';
import CartDrawer from '../../features/ordering/components/CartDrawer';
import CustomizationModal from '../../features/ordering/components/CustomizationModal';
import './OrderPage.css';

const OrderPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Use Cart Hook
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice
    } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [customizingProduct, setCustomizingProduct] = useState(null);
    const { ref: categoryBarRef, isDragging, events: dragEvents } = useDraggableScroll();

    const fetchInitialData = async () => {
        try {
            // 1. Fetch Products
            const productsData = await api.getProducts();
            setProducts(productsData);

            // 2. Fetch Shop Status
            const isEnabled = await api.getShopStatus();
            setIsShopOpen(isEnabled);

        } catch (err) {
            console.error('Error fetching initial data:', err);
            setError('Αδυναμία φόρτωσης καταλόγου. Παρακαλώ ανανεώστε τη σελίδα.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();

        // 3. Real-time Shop Status Subscription
        const unsubscribe = api.subscribeToShopStatus((newValue) => {
            setIsShopOpen(newValue);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const categories = [...new Set(products.map(item => item.category))].sort((a, b) => {
        const idxA = CATEGORY_ORDER.indexOf(a);
        const idxB = CATEGORY_ORDER.indexOf(b);

        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    const filteredItems = selectedCategory
        ? products.filter(item => item.category === selectedCategory)
        : products.filter(item => item.category === categories[0]);

    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const handleAddToCart = (item, options = null) => {
        // Wrapper to check shop status and handle customization modal trigger
        if (!isShopOpen) return;

        if (needsCustomization(item) && !options) {
            setCustomizingProduct(item);
            return;
        }

        let itemToAdd = { ...item };
        if (options && options.extraPrice) {
            itemToAdd.price = parseFloat(itemToAdd.price) + options.extraPrice;
        }

        addToCart(itemToAdd, options, isShopOpen);
        setCustomizingProduct(null);
    };

    if (error) {
        return (
            <div className="order-page-root">
                <main className="order-main error-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent-orange)', marginBottom: '10px' }}>Ωχ! Κάτι πήγε στραβά.</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
                    <button className="add-btn" onClick={() => window.location.reload()}>
                        Ανανέωση Σελίδας
                    </button>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="order-page-root">
                <main className="order-main loading-container">
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
                    <img src="/images/logo.png" alt="Short Coffee Logo" className="minimal-logo" />
                    <div className="header-text">
                        <h1>SHORT COFFEE</h1>
                        <p>COFFEE BAR</p>
                    </div>
                </div>
            </header>

            {/* Category Scroll */}
            <div className="category-bar-wrapper">
                <div
                    className={`category-bar animate-slide-in ${isDragging ? 'dragging' : ''}`}
                    ref={categoryBarRef}
                    {...dragEvents}
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
            <div className={`shop-closed-overlay ${!isShopOpen ? 'visible' : ''}`}>
                <div className="closed-content premium-card">
                    <img src="/images/logo.png" alt="Short Coffee Logo" className="closed-logo" />
                    <h2>Είμαστε Κλειστά</h2>
                    <p>Αυτή τη στιγμή δεν δεχόμαστε νέες παραγγελίες. <br /> Παρακαλούμε δοκιμάστε αργότερα!</p>
                    <div className="closed-hours">Σας ευχαριστούμε για την προτίμηση!</div>
                </div>
            </div>

            {/* Menu Sections */}
            <main className="order-main">
                <MenuGrid
                    items={filteredItems.map(item => ({
                        ...item,
                        image: item.image_url // Mapping DB field to component prop
                    }))}
                    onAdd={handleAddToCart}
                />
                {filteredItems.length === 0 && (
                    <p className="no-products-msg">
                        Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία.
                    </p>
                )}
            </main>

            {/* Floating Cart Button */}
            {
                totalItems > 0 && (
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
                )
            }

            {/* Cart Drawer Overlay */}
            {
                isCartOpen && (
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
                )
            }

            {/* Customization Modal */}
            {
                customizingProduct && (
                    <CustomizationModal
                        product={customizingProduct}
                        onClose={() => setCustomizingProduct(null)}
                        onConfirm={(options) => handleAddToCart(customizingProduct, options)}
                    />
                )
            }
        </div >
    );
};

export default OrderPage;
