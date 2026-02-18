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
        // 1. Insert Order
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Insert Items
        const orderItems = cartItems.map(item => ({
            order_id: newOrder.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: item.options
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return newOrder;
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
    }
};
