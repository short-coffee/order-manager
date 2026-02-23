import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabase';

const OrderCard = ({ order, onOpenDetails }) => {
    const [updating, setUpdating] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const statusMapping = {
        pending: { label: 'ΕΚΚΡΕΜΕΙ', color: 'var(--accent-orange)' },
        preparing: { label: 'ΠΡΟΕΤΟΙΜΑΖΕΤΑΙ', color: 'var(--primary)' },
        ready: { label: 'ΕΤΟΙΜΗ', color: 'var(--accent-green)' },
        delivering: { label: 'ΣΕ ΔΙΑΝΟΜΗ', color: 'var(--secondary)' },
        delivered: { label: 'ΠΑΡΑΔΟΘΗΚΕ', color: 'var(--text-muted)' }
    };

    const currentStatus = statusMapping[order.status] || { label: order.status, color: 'var(--text-muted)' };

    // Support both mock data and Supabase data
    const items = order.order_items || order.items || [];
    const totalPrice = order.total_price || order.total || 0;

    // Format timestamp
    let displayTime = order.timestamp;
    if (order.created_at) {
        const date = new Date(order.created_at);
        displayTime = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
    }

    const deleteOrder = async () => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', order.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Σφάλμα κατά τη διαγραφή της παραγγελίας.');
        } finally {
            setUpdating(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Σφάλμα κατά την ενημέρωση της κατάστασης.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div
            className="premium-card order-card clickable-card"
            onClick={onOpenDetails}
        >
            {showCancelConfirm && createPortal(
                <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Οριστική Διαγραφή;</h3>
                        <p>Είστε σίγουροι ότι θέλετε να ΔΙΑΓΡΑΨΕΤΕ την παραγγελία #{order.id.toString().slice(-4).toUpperCase()}; Αυτό θα αφαιρέσει οριστικά την παραγγελία από τη βάση δεδομένων.</p>
                        <div className="modal-footer">
                            <button className="cancel-modal-btn" onClick={() => setShowCancelConfirm(false)}>
                                ΟΧΙ, ΠΙΣΩ
                            </button>
                            <button className="confirm-modal-btn" onClick={() => {
                                deleteOrder();
                                setShowCancelConfirm(false);
                            }}>
                                ΝΑΙ, ΔΙΑΓΡΑΦΗ
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <div className="card-header">
                <span className="order-id">ΠΑΡΑΓΓΕΛΙΑ #{order.id.toString().slice(-4).toUpperCase()}</span>
                <span className="status-label" style={{
                    backgroundColor: `${currentStatus.color}15`,
                    color: currentStatus.color,
                    border: `1px solid ${currentStatus.color}30`
                }}>
                    {currentStatus.label}
                </span>
            </div>

            <div className="order-items">
                {items.map((item, idx) => (
                    <div key={idx} className="order-item-row-wrapper">
                        <div className="order-item-row">
                            <span className="item-name">{item.quantity}x {item.product_name || item.name}</span>
                            <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.options && (
                            <div className="order-item-options-admin">
                                {item.options.sugar && item.options.sugar !== 'none' && (
                                    <span className={`sugar-tag ${item.options.sugar}`}>
                                        {item.options.sugar === 'medium' ? 'ΜΕΤΡΙΟΣ' :
                                            item.options.sugar === 'sweet' ? 'ΓΛΥΚΟΣ' :
                                                item.options.sugar === 'little' ? 'ΜΕ ΟΛΙΓΗ' :
                                                    item.options.sugar === 'saccharin' ? 'ΖΑΧΑΡΙΝΗ' :
                                                        item.options.sugar === 'stevia' ? 'ΣΤΕΒΙΑ' :
                                                            item.options.sugar === 'brown' ? 'ΜΑΥΡΗ' : item.options.sugar}
                                    </span>
                                )}
                                {item.options.sugar === 'none' && <span className="sugar-tag none">ΣΚΕΤΟΣ</span>}
                                {item.options.decaf && <span className="decaf-tag">DECAF</span>}
                                {item.options.temperature && (
                                    <span className="temp-tag" style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                        {item.options.temperature === 'hot' ? 'ΖΕΣΤΗ' : 'ΚΡΥΑ'}
                                    </span>
                                )}
                                {item.options.flavor && (
                                    <span className="flavor-tag" style={{ border: '1px solid #ead09e', backgroundColor: '#fdf3de', color: '#b56d19', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                        {item.options.flavor === 'caramel' ? 'ΚΑΡΑΜΕΛΑ' :
                                            item.options.flavor === 'strawberry' ? 'ΦΡΑΟΥΛΑ' :
                                                item.options.flavor === 'hazelnut' ? 'ΦΟΥΝΤΟΥΚΙ' :
                                                    item.options.flavor === 'vanilla' ? 'ΒΑΝΙΛΙΑ' :
                                                        item.options.flavor === 'coconut' ? 'ΚΑΡΥΔΑ' :
                                                            item.options.flavor === 'raspberry' ? 'ΒΑΤΟΜΟΥΡΟ' :
                                                                item.options.flavor === 'banana' ? 'ΜΠΑΝΑΝΑ' :
                                                                    item.options.flavor === 'passion_fruit' ? 'PASSION FRUIT' :
                                                                        item.options.flavor === 'lime' ? 'LIME' :
                                                                            item.options.flavor === 'chocolate' ? 'ΣΟΚΟΛΑΤΑ' :
                                                                                item.options.flavor === 'stracciatella' ? 'ΣΤΡΑΤΣΙΑΤΕΛΑ' :
                                                                                    item.options.flavor === 'amarena' ? 'ΑΜΑΡΕΝΑ' :
                                                                                        item.options.flavor === 'banoffee' ? 'ΜΠΑΝΟΦΙ' :
                                                                                            item.options.flavor === 'cookies' ? 'COOKIES' :
                                                                                                item.options.flavor === 'bueno' ? 'BUENO' :
                                                                                                    item.options.flavor === 'jasmine' ? 'ΓΙΑΣΕΜΙ' :
                                                                                                        item.options.flavor === 'mint' ? 'ΜΕΝΤΑ' :
                                                                                                            item.options.flavor === 'lemon' ? 'ΛΕΜΟΝΙ' :
                                                                                                                item.options.flavor === 'orange' ? 'ΠΟΡΤΟΚΑΛΙ' :
                                                                                                                    item.options.flavor === 'green' ? 'ΠΡΑΣΙΝΟ' :
                                                                                                                        item.options.flavor === 'cinnamon' ? 'ΚΑΝΕΛΑ' :
                                                                                                                            item.options.flavor === 'english_breakfast' ? 'ENGLISH BREAKFAST' :
                                                                                                                                item.options.flavor === 'peach' ? 'ΡΟΔΑΚΙΝΟ' :
                                                                                                                                    item.options.flavor === 'green_sugar_free' ? 'ΠΡΑΣΙΝΟ ΧΩΡΙΣ ΖΑΧΑΡΗ' :
                                                                                                                                        item.options.flavor === 'cheese_turkey' ? 'ΤΥΡΙ-ΓΑΛΟΠΟΥΛΑ' :
                                                                                                                                            item.options.flavor === 'cheese_ham' ? 'ΤΥΡΙ-ΖΑΜΠΟΝ' :
                                                                                                                                                item.options.flavor === 'cheese' ? 'ΣΚΕΤΟ ΤΥΡΙ' :
                                                                                                                                                    item.options.flavor === 'turkey' ? 'ΣΚΕΤΗ ΓΑΛΟΠΟΥΛΑ' :
                                                                                                                                                        item.options.flavor === 'ham' ? 'ΣΚΕΤΟ ΖΑΜΠΟΝ' :
                                                                                                                                                            item.options.flavor === 'baguette_turkey' ? 'ΓΑΛΟΠΟΥΛΑ, ΤΥΡΙ, ΝΤΟΜΑΤΑ, ΜΑΡΟΥΛΙ, ΜΑΓΙΟΝΕΖΑ' :
                                                                                                                                                                item.options.flavor === 'baguette_ham' ? 'ΖΑΜΠΟΝ, ΤΥΡΙ, ΝΤΟΜΑΤΑ, ΜΑΡΟΥΛΙ, ΜΑΓΙΟΝΕΖΑ' : item.options.flavor}
                                    </span>
                                )}
                                {item.options.extraScoops && item.options.extraScoops.map((scoop, index) => (
                                    <span key={index} className="flavor-tag extra-scoop" style={{ border: '1px solid #ead09e', backgroundColor: '#fdf3de', color: '#b56d19', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginLeft: '4px' }}>
                                        + {scoop === 'caramel' ? 'ΚΑΡΑΜΕΛΑ' :
                                            scoop === 'strawberry' ? 'ΦΡΑΟΥΛΑ' :
                                                scoop === 'hazelnut' ? 'ΦΟΥΝΤΟΥΚΙ' :
                                                    scoop === 'vanilla' ? 'ΒΑΝΙΛΙΑ' :
                                                        scoop === 'coconut' ? 'ΚΑΡΥΔΑ' :
                                                            scoop === 'raspberry' ? 'ΒΑΤΟΜΟΥΡΟ' :
                                                                scoop === 'banana' ? 'ΜΠΑΝΑΝΑ' :
                                                                    scoop === 'passion_fruit' ? 'PASSION FRUIT' :
                                                                        scoop === 'lime' ? 'LIME' :
                                                                            scoop === 'chocolate' ? 'ΣΟΚΟΛΑΤΑ' :
                                                                                scoop === 'stracciatella' ? 'ΣΤΡΑΤΣΙΑΤΕΛΑ' :
                                                                                    scoop === 'amarena' ? 'ΑΜΑΡΕΝΑ' :
                                                                                        scoop === 'banoffee' ? 'ΜΠΑΝΟΦΙ' :
                                                                                            scoop === 'cookies' ? 'COOKIES' :
                                                                                                scoop === 'bueno' ? 'BUENO' : scoop}
                                    </span>
                                ))}
                                {item.options.removedIngredients && item.options.removedIngredients.map((ing, index) => (
                                    <span key={`rm-${index}`} className="flavor-tag" style={{ border: '1px solid #f2dede', backgroundColor: '#fce4e4', color: '#d9534f', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginLeft: '4px' }}>
                                        ΧΩΡΙΣ {ing.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="customer-info">
                <div><b>Όνομα:</b> {order.customer_name}</div>
                <div><b>Τηλ:</b> {order.customer_phone}</div>
                <div><b>Διεύθυνση:</b> {order.customer_address}</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {order.bell && <div><b>Κουδούνι:</b> {order.bell}</div>}
                    {order.floor && <div><b>Όροφος:</b> {order.floor}</div>}
                </div>
                {order.comments && (
                    <div className="order-comments">
                        <b>Σχόλια:</b> {order.comments}
                    </div>
                )}
            </div>

            <div className="card-footer">
                <div className="card-footer-info">
                    <span className="time-stamp">{displayTime}</span>
                    <span className="total-price">€{totalPrice.toFixed(2)}</span>
                </div>

                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                    {['pending', 'preparing', 'ready', 'delivering'].includes(order.status) && (
                        <button
                            className="cancel-btn"
                            onClick={() => setShowCancelConfirm(true)}
                            disabled={updating}
                            title="ΑΚΥΡΩΣΗ"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    )}
                    {['pending', 'preparing', 'ready'].includes(order.status) && (
                        <button
                            className="action-btn send-btn"
                            onClick={() => updateStatus('delivering')}
                            disabled={updating}
                        >
                            {updating ? '...' : 'ΑΠΟΣΤΟΛΗ'}
                        </button>
                    )}
                    {order.status === 'delivering' && (
                        <button
                            className="action-btn complete-btn"
                            onClick={() => updateStatus('delivered')}
                            disabled={updating}
                        >
                            {updating ? '...' : 'ΟΛΟΚΛΗΡΩΣΗ'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;