import React, { useEffect, useState, useMemo } from 'react';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';
import { api } from '../../../services/api';
import { STATUS_MAPPING } from '../../../lib/constants';
import { useAudioNotification } from '../../../hooks/useAudioNotification';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const {
        showAudioModal,
        isClosing,
        playNotificationSound,
        enableAudio
    } = useAudioNotification();

    const fetchOrders = async () => {
        try {
            const data = await api.getOrders();
            setOrders(data);

            if (selectedOrder) {
                const updated = data.find(o => o.id === selectedOrder.id);
                if (updated) setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const archiveCompleted = async () => {
        const completedIds = orders.filter(o => o.status === 'delivered').map(o => o.id);
        if (completedIds.length === 0) return;

        try {
            await api.archiveOrders(completedIds);
            // Optimistic update or refetch handled by subscription usually, but here we might want to refresh
            fetchOrders();
        } catch (error) {
            console.error('Error archiving orders:', error);
            alert('Σφάλμα κατά την αρχειοθέτηση.');
        }
    };

    useEffect(() => {
        fetchOrders();

        const unsubscribe = api.subscribeToOrders((payload) => {
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
            }
            fetchOrders();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const { inboundOrders, deliveringOrders, completedOrders } = useMemo(() => {
        return {
            inboundOrders: orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)),
            deliveringOrders: orders.filter(o => o.status === 'delivering'),
            completedOrders: orders.filter(o => o.status === 'delivered')
        };
    }, [orders]);

    if (loading) {
        return <div className="loading-state">Φόρτωση παραγγελιών...</div>;
    }

    // ... renderModal removed

    return (
        <div className="dashboard-container">

            {/* Audio Enable Modal */}
            {showAudioModal && (
                <div className={`audio-modal-overlay ${isClosing ? 'fading-out' : ''}`}>
                    <div className="audio-modal-content">
                        <h3>Καλώς ήρθατε!</h3>
                        <p>Για να λαμβάνετε ηχητικές ειδοποιήσεις για νέες παραγγελίες, πατήστε συνέχεια.</p>
                        <button className="pro-btn" onClick={enableAudio}>
                            ΣΥΝΕΧΕΙΑ
                        </button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="kanban-grid">
                <div className="kanban-column inbound">
                    <div className="column-header-with-action">
                        <h3 className="column-title">ΝΕΕΣ / ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ ({inboundOrders.length})</h3>
                    </div>
                    <div className="kanban-scroll-area">
                        {inboundOrders.map(order => (
                            <OrderCard key={order.id} order={order} onOpenDetails={() => setSelectedOrder(order)} />
                        ))}
                        {inboundOrders.length === 0 && <p className="empty-msg">Καμία νέα παραγγελία</p>}
                    </div>
                </div>

                <div className="kanban-column delivering">
                    <div className="column-header-with-action">
                        <h3 className="column-title">ΣΕ ΔΙΑΝΟΜΗ ({deliveringOrders.length})</h3>
                    </div>
                    <div className="kanban-scroll-area">
                        {deliveringOrders.map(order => (
                            <OrderCard key={order.id} order={order} onOpenDetails={() => setSelectedOrder(order)} />
                        ))}
                        {deliveringOrders.length === 0 && <p className="empty-msg">Καμία παραγγελία σε διανομή</p>}
                    </div>
                </div>

                <div className="kanban-column completed">
                    <div className="column-header-with-action">
                        <h3 className="column-title">ΟΛΟΚΛΗΡΩΜΕΝΕΣ ({completedOrders.length})</h3>
                        {completedOrders.length > 0 && (
                            <button className="clear-column-btn" onClick={archiveCompleted} title="Αρχειοθέτηση όλων">
                                ΚΑΘΑΡΙΣΜΟΣ
                            </button>
                        )}
                    </div>
                    <div className="kanban-scroll-area">
                        {completedOrders.map(order => (
                            <OrderCard key={order.id} order={order} onOpenDetails={() => setSelectedOrder(order)} />
                        ))}
                        {completedOrders.length === 0 && <p className="empty-msg">Δεν υπάρχουν ολοκληρωμένες παραγγελίες</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
