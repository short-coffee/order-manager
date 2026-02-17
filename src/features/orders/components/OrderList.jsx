import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import { supabase } from '../../../lib/supabase';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('dashboard-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders(); // Re-fetch all to get nested items and updated states
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return <div className="loading-state">Φόρτωση παραγγελιών...</div>;
    }

    // Φιλτράρισμα παραγγελιών ανά στήλη
    const inboundOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
    const deliveringOrders = orders.filter(o => o.status === 'delivering');
    const completedOrders = orders.filter(o => o.status === 'delivered');

    return (
        <div className="kanban-grid">
            {/* Στήλη 1: ΝΕΕΣ / ΠΡΟΕΤΟΙΜΑΣΙΑ */}
            <div className="kanban-column inbound">
                <h3 className="column-title">ΝΕΕΣ / ΠΡΟΕΤΟΙΜΑΣΙΑ ({inboundOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {inboundOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                    {inboundOrders.length === 0 && <p className="empty-msg">Καμία νέα παραγγελία</p>}
                </div>
            </div>

            {/* Στήλη 2: ΣΕ ΔΙΑΝΟΜΗ */}
            <div className="kanban-column delivering">
                <h3 className="column-title">ΣΕ ΔΙΑΝΟΜΗ ({deliveringOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {deliveringOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                    {deliveringOrders.length === 0 && <p className="empty-msg">Καμία παραγγελία σε διανομή</p>}
                </div>
            </div>

            {/* Στήλη 3: ΟΛΟΚΛΗΡΩΜΕΝΕΣ */}
            <div className="kanban-column completed">
                <h3 className="column-title">ΟΛΟΚΛΗΡΩΜΕΝΕΣ ({completedOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {completedOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                    {completedOrders.length === 0 && <p className="empty-msg">Δεν υπάρχουν ολοκληρωμένες παραγγελίες</p>}
                </div>
            </div>
        </div>
    );
};

export default OrderList;
