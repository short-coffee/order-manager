import { useCart } from '../../hooks/useCart';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CATEGORY_MAPPING, CATEGORY_ORDER } from '../../lib/constants';
import MenuGrid from '../../features/ordering/components/MenuGrid';
import CartDrawer from '../../features/ordering/components/CartDrawer';
import CustomizationModal from '../../features/ordering/components/CustomizationModal';
import './OrderPage.css';

const OrderPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('coffee');

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
            const productsData = await api.getProducts();
            setProducts(productsData);

            // 2. Fetch Shop Status
            const isEnabled = await api.getShopStatus();
            setIsShopOpen(isEnabled);

        } catch (error) {
            console.error('Error fetching initial data:', error);
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

    const filteredItems = products.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item, options = null) => {
        // Wrapper to check shop status and handle customization modal trigger
        if (!isShopOpen) return;

        // Check if item needs customization (only coffee for now)
        const needsCustomization = item.category === 'coffee';

        if (needsCustomization && !options) {
            setCustomizingProduct(item);
            return;
        }

        addToCart(item, options, isShopOpen);
        setCustomizingProduct(null);
    };


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
