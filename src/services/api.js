import { supabase } from '../lib/supabase';

export const api = {
    // Products
    getProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Settings / Shop Status
    getShopStatus: async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'is_ordering_enabled')
            .single();

        if (error) throw error;
        return data?.value ?? true; // Default to true if not found, or handle as needed
    },

    subscribeToShopStatus: (callback) => {
        const subscription = supabase
            .channel('shop-status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'settings',
                filter: 'key=eq.is_ordering_enabled'
            }, (payload) => {
                callback(payload.new.value);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    // Orders (for OrderList.jsx later)
    // Orders
    getOrders: async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    submitOrder: async (orderData, cartItems) => {
        try {
            // 1. Insert Order
            const { data: newOrder, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) {
                console.error('[API] Order Insert Error:', orderError);
                throw orderError;
            }

            // 2. Insert Items
            const orderItems = cartItems.map(item => ({
                order_id: newOrder.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: item.options
            }));

            console.log('[API] Attempting to insert order items:', orderItems);

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error('[API] Items Insert Error:', itemsError);
                throw itemsError;
            }

            return newOrder;
        } catch (err) {
            console.error('[API] submitOrder Caught Exception:', err);
            throw err;
        }
    },

    subscribeToOrders: (callback) => {
        const subscription = supabase
            .channel('dashboard-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    archiveOrders: async (ids) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'archived' })
            .in('id', ids);

        if (error) throw error;
    },

    // History
    getHistory: async (date) => {
        // Range: 00:00:00 - 23:59:59
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .in('status', ['delivered', 'archived'])
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    toggleShopStatus: async (isOpen) => {
        const { error } = await supabase
            .from('settings')
            .update({ value: isOpen })
            .eq('key', 'is_ordering_enabled');

        if (error) throw error;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};
