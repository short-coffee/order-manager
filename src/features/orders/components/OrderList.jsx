import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import { supabase } from '../../../lib/supabase';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusMapping = {
        pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
        preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
        ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
        delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
        delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' },
        archived: { label: 'ΑΡΧΕΙΟΘΕΤΗΜΕΝΗ', color: 'var(--text-muted)' }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);

            if (selectedOrder) {
                const updated = (data || []).find(o => o.id === selectedOrder.id);
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
            const { error } = await supabase
                .from('orders')
                .update({ status: 'archived' })
                .in('id', completedIds);

            if (error) throw error;
        } catch (error) {
            console.error('Error archiving orders:', error);
            alert('Σφάλμα κατά την αρχειοθέτηση.');
        }
    };

    useEffect(() => {
        fetchOrders();

        const channel = supabase
            .channel('dashboard-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders();
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

    const inboundOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
    const deliveringOrders = orders.filter(o => o.status === 'delivering');
    const completedOrders = orders.filter(o => o.status === 'delivered');

    const renderModal = () => {
        if (!selectedOrder) return null;

        const currentStatus = statusMapping[selectedOrder.status] || { label: selectedOrder.status, color: 'var(--text-muted)' };
        const items = selectedOrder.order_items || [];
        const totalPrice = selectedOrder.total_price || 0;
        const displayTime = new Date(selectedOrder.created_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="modal-overlay details-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="confirm-modal details-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title-group">
                            <h3>Λεπτομέρειες Παραγγελίας</h3>
                            <span className="modal-status" style={{ color: currentStatus.color }}>
                                {currentStatus.label}
                            </span>
                        </div>
                        <button className="modal-close-icon" onClick={() => setSelectedOrder(null)}>×</button>
                    </div>

                    <div className="modal-scroll-body">
                        <div className="modal-section" style={{ marginBottom: '1.5rem' }}>
                            <span className="modal-time" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {displayTime} • {new Date(selectedOrder.created_at).toLocaleDateString('el-GR')}
                            </span>
                        </div>

                        <div className="modal-section">
                            <span className="section-label">ΠΡΟΪΟΝΤΑ</span>
                            <div className="modal-items-list">
                                {items.map((item, idx) => (
                                    <div key={idx} className="modal-item-row">
                                        <div className="item-qty-name">
                                            <span className="qty">{item.quantity}x</span>
                                            <div className="name-options">
                                                <span className="name">{item.product_name || item.name}</span>
                                                {item.options && (
                                                    <div className="options">
                                                        {item.options.sugar && <span>• {
                                                            item.options.sugar === 'none' ? 'Σκέτος' :
                                                                item.options.sugar === 'medium' ? 'Μέτριος' :
                                                                    item.options.sugar === 'sweet' ? 'Γλυκός' :
                                                                        item.options.sugar === 'little' ? 'Με ολίγη' :
                                                                            item.options.sugar === 'saccharin' ? 'Ζαχαρίνη' :
                                                                                item.options.sugar === 'stevia' ? 'Στέβια' :
                                                                                    item.options.sugar === 'brown' ? 'Μαύρη' : item.options.sugar
                                                        }</span>}
                                                        {item.options.decaf && <span>• Decaf</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="price">€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-section-grid">
                            <div className="modal-section">
                                <span className="section-label">ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ</span>
                                <div className="customer-detail"><b>Ονομα:</b> {selectedOrder.customer_name}</div>
                                <div className="customer-detail"><b>Τηλ:</b> {selectedOrder.customer_phone}</div>
                                <div className="customer-detail"><b>Διεύθυνση:</b> {selectedOrder.customer_address}</div>
                            </div>
                            <div className="modal-section">
                                <span className="section-label">ΤΟΠΟΘΕΣΙΑ</span>
                                <div className="customer-detail"><b>Κουδούνι:</b> {selectedOrder.bell || '-'}</div>
                                <div className="customer-detail"><b>Όροφος:</b> {selectedOrder.floor || '-'}</div>
                            </div>
                        </div>

                        {selectedOrder.comments && (
                            <div className="modal-section">
                                <span className="section-label">ΣΧΟΛΙΑ</span>
                                <div className="modal-comments-box">{selectedOrder.comments}</div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer-price">
                        <span className="total-label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</span>
                        <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="kanban-grid">
            {renderModal()}
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
    );
};

export default OrderList;
