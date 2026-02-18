import React, { useState } from 'react';
import './CustomizationModal.css';

const SUGAR_OPTIONS = [
    { id: 'none', label: 'ΣΚΕΤΟ' },
    { id: 'medium', label: 'ΜΕΤΡΙΟ' },
    { id: 'sweet', label: 'ΓΛΥΚΟ' },
    { id: 'little', label: 'ΜΕ ΟΛΙΓΗ' },
    { id: 'saccharin', label: 'ΖΑΧΑΡΙΝΗ' },
    { id: 'stevia', label: 'ΣΤΕΒΙΑ' },
    { id: 'brown', label: 'ΜΑΥΡΗ ΖΑΧΑΡΗ' }
];

const CustomizationModal = ({ product, onClose, onConfirm }) => {
    const [selectedSugar, setSelectedSugar] = useState('medium');
    const [isDecaf, setIsDecaf] = useState(false);

    const handleConfirm = () => {
        onConfirm({
            sugar: selectedSugar,
            decaf: isDecaf
        });
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content premium-card animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="modal-header-cust">
                    <h3>Προσαρμογή</h3>
                    <p>{product.name}</p>
                    <button className="close-btn-cust" onClick={onClose}>&times;</button>
                </div>

                <div className="customization-section">
                    <h4>Επίπεδο Ζάχαρης</h4>
                    <div className="sugar-grid">
                        {SUGAR_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                className={`sugar-btn ${selectedSugar === opt.id ? 'active' : ''}`}
                                onClick={() => setSelectedSugar(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="customization-section">
                    <div className="decaf-toggle-row">
                        <div>
                            <h4>Ντεκαφεϊνέ</h4>
                            <p className="sub-label">Χωρίς καφεΐνη</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isDecaf}
                                onChange={(e) => setIsDecaf(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                <div className="modal-actions-cust">
                    <button className="cancel-btn-cust" onClick={onClose}>ΑΚΥΡΩΣΗ</button>
                    <button className="confirm-btn-cust" onClick={handleConfirm}>
                        ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;