import React from 'react';
import OrderCard from './OrderCard';
import { initialOrders } from '../data/mockData';

const OrderList = () => {
    // Φιλτράρισμα παραγγελιών ανά στήλη
    const inboundOrders = initialOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
    const deliveringOrders = initialOrders.filter(o => o.status === 'delivering');
    const completedOrders = initialOrders.filter(o => o.status === 'delivered');

    return (
        <div className="kanban-grid">
            {/* Στήλη 1: ΝΕΕΣ / ΠΡΟΕΤΟΙΜΑΣΙΑ */}
            <div className="kanban-column inbound">
                <h3 className="column-title">ΝΕΕΣ / ΠΡΟΕΤΟΙΜΑΣΙΑ ({inboundOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {inboundOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>

            {/* Στήλη 2: ΣΕ ΔΙΑΝΟΜΗ */}
            <div className="kanban-column delivering">
                <h3 className="column-title">ΣΕ ΔΙΑΝΟΜΗ ({deliveringOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {deliveringOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>

            {/* Στήλη 3: ΟΛΟΚΛΗΡΩΜΕΝΕΣ */}
            <div className="kanban-column completed">
                <h3 className="column-title">ΟΛΟΚΛΗΡΩΜΕΝΕΣ ({completedOrders.length})</h3>
                <div className="kanban-scroll-area">
                    {completedOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderList;
