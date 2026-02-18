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
    getOrders: async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    archiveOrders: async (ids) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'archived' })
            .in('id', ids);

        if (error) throw error;
    }
};
