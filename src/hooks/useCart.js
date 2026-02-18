import { useState, useEffect } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, options = null, isShopOpen = true) => {
        if (!isShopOpen) return;

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

            // Close cart using safe check if cart becomes empty
            if (updated.length === 0) setIsCartOpen(false);

            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        setIsCartOpen(false);
        localStorage.removeItem('cart');
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };
};
