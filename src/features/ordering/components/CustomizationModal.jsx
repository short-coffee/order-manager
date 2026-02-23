import React, { useState } from 'react';
import './CustomizationModal.css';
import {
    SUGAR_OPTIONS, TEMP_OPTIONS, FLAVOR_OPTIONS,
    SMOOTHIE_FLAVOR_OPTIONS, MILKSHAKE_FLAVOR_OPTIONS,
    HOT_TEA_FLAVOR_OPTIONS, ICE_TEA_FLAVOR_OPTIONS,
    TOAST_OPTIONS, BAGUETTE_OPTIONS, BAGUETTE_INGREDIENTS
} from '../../../lib/constants';


const CustomizationModal = ({ product, onClose, onConfirm }) => {
    const isCoffee = product.category === 'coffee' && product.id !== 'coffee18';
    const canHaveDecaf = ['coffee06', 'coffee07', 'coffee08', 'coffee09', 'coffee13'].includes(product.id);
    const isFlavoredCoffee = product.category === 'coffee' && product.id === 'coffee18';
    const isFlavoredChocolate = product.category === 'chocolates' && product.id === 'chocolates09';
    const isChocolate = product.id === 'chocolates01' || product.id === 'chocolates02';
    const isSmoothieOrGranita = product.id === 'rofimata03' || product.id === 'rofimata04';
    const isMilkshake = product.id === 'rofimata05';
    const isHotTea = product.id === 'tea01';
    const isIceTea = product.id === 'tea02';
    const isIceCream = product.id === 'sweets01';
    const isToast = product.id === 'snacks03';
    const isBaguette = product.id === 'snacks01';

    const [selectedSugar, setSelectedSugar] = useState('medium');
    const [isDecaf, setIsDecaf] = useState(false);
    const [selectedTemp, setSelectedTemp] = useState('hot');
    const [selectedFlavor, setSelectedFlavor] = useState('caramel');
    const [selectedSmoothieFlavor, setSelectedSmoothieFlavor] = useState('strawberry');
    const [selectedMilkshakeFlavor, setSelectedMilkshakeFlavor] = useState('vanilla');
    const [selectedTeaFlavor, setSelectedTeaFlavor] = useState('jasmine');
    const [selectedIceTeaFlavor, setSelectedIceTeaFlavor] = useState('peach');
    const [selectedIceCreamFlavor, setSelectedIceCreamFlavor] = useState('vanilla');
    const [extraScoops, setExtraScoops] = useState([]);
    const [selectedToastOption, setSelectedToastOption] = useState('cheese_turkey');
    const [selectedBaguetteOption, setSelectedBaguetteOption] = useState('baguette_turkey');
    const [removedIngredients, setRemovedIngredients] = useState([]);

    const toggleIngredient = (ingredient) => {
        if (removedIngredients.includes(ingredient)) {
            setRemovedIngredients(removedIngredients.filter(i => i !== ingredient));
        } else {
            setRemovedIngredients([...removedIngredients, ingredient]);
        }
    };

    const handleConfirm = () => {
        if (isCoffee) {
            onConfirm({
                sugar: selectedSugar,
                decaf: isDecaf
            });
        } else if (isFlavoredCoffee) {
            onConfirm({
                sugar: selectedSugar,
                flavor: selectedFlavor
            });
        } else if (isChocolate) {
            onConfirm({
                temperature: selectedTemp
            });
        } else if (isFlavoredChocolate) {
            onConfirm({
                flavor: selectedFlavor
            });
        } else if (isSmoothieOrGranita) {
            onConfirm({
                flavor: selectedSmoothieFlavor
            });
        } else if (isMilkshake) {
            onConfirm({
                flavor: selectedMilkshakeFlavor
            });
        } else if (isHotTea) {
            onConfirm({
                flavor: selectedTeaFlavor
            });
        } else if (isIceTea) {
            onConfirm({
                flavor: selectedIceTeaFlavor
            });
        } else if (isIceCream) {
            onConfirm({
                flavor: selectedIceCreamFlavor,
                extraScoops: extraScoops,
                extraPrice: extraScoops.length * 1.50
            });
        } else if (isToast) {
            onConfirm({
                flavor: selectedToastOption
            });
        } else if (isBaguette) {
            onConfirm({
                flavor: selectedBaguetteOption,
                removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined
            });
        }
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content premium-card animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="modal-header-cust">
                    <h3>Προσαρμογή</h3>
                    <p>{product.name}</p>
                    <button className="close-btn-cust" onClick={onClose}>&times;</button>
                </div>

                {(isCoffee || isFlavoredCoffee) && (
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
                )}

                {canHaveDecaf && (
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
                )}

                {isFlavoredCoffee && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isChocolate && (
                    <div className="customization-section">
                        <h4>Θερμοκρασία</h4>
                        <div className="sugar-grid">
                            {TEMP_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedTemp === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedTemp(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isFlavoredChocolate && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isSmoothieOrGranita && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {SMOOTHIE_FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedSmoothieFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSmoothieFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isMilkshake && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {MILKSHAKE_FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedMilkshakeFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedMilkshakeFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isHotTea && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {HOT_TEA_FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedTeaFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedTeaFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isIceTea && (
                    <div className="customization-section">
                        <h4>Γεύση</h4>
                        <div className="sugar-grid">
                            {ICE_TEA_FLAVOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedIceTeaFlavor === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedIceTeaFlavor(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isIceCream && (
                    <>
                        <div className="customization-section">
                            <h4>Γεύση (Βάση)</h4>
                            <div className="sugar-grid">
                                {MILKSHAKE_FLAVOR_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`sugar-btn ${selectedIceCreamFlavor === opt.id ? 'active' : ''}`}
                                        onClick={() => setSelectedIceCreamFlavor(opt.id)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="customization-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4 style={{ margin: 0 }}>Έξτρα Μπάλα (+1.50€)</h4>
                                <button
                                    className="add-btn"
                                    onClick={() => setExtraScoops([...extraScoops, 'vanilla'])}
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                    + Προσθήκη
                                </button>
                            </div>

                            {extraScoops.map((scoopFlavor, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', color: '#b56d19', fontWeight: 'bold' }}>#{idx + 1}</span>
                                    <select
                                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ead09e', backgroundColor: '#fdf3de', color: '#5a3d2b', fontFamily: 'inherit' }}
                                        value={scoopFlavor}
                                        onChange={(e) => {
                                            const newScoops = [...extraScoops];
                                            newScoops[idx] = e.target.value;
                                            setExtraScoops(newScoops);
                                        }}
                                    >
                                        {MILKSHAKE_FLAVOR_OPTIONS.map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const newScoops = [...extraScoops];
                                            newScoops.splice(idx, 1);
                                            setExtraScoops(newScoops);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {isToast && (
                    <div className="customization-section">
                        <h4>Επιλογές Τοστ</h4>
                        <div className="sugar-grid">
                            {TOAST_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`sugar-btn ${selectedToastOption === opt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedToastOption(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isBaguette && (
                    <>
                        <div className="customization-section">
                            <h4>Επιλογές Μπακέτας</h4>
                            <div className="sugar-grid" style={{ gridTemplateColumns: 'minmax(120px, 1fr)' }}>
                                {BAGUETTE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`sugar-btn ${selectedBaguetteOption === opt.id ? 'active' : ''}`}
                                        style={{ whiteSpace: 'normal', height: 'auto', padding: '12px' }}
                                        onClick={() => {
                                            setSelectedBaguetteOption(opt.id);
                                            setRemovedIngredients([]);
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="customization-section">
                            <h4>Χωρίς (Αφαίρεση Υλικών)</h4>
                            <div className="sugar-grid">
                                {BAGUETTE_INGREDIENTS[selectedBaguetteOption].map(ingredient => (
                                    <button
                                        key={ingredient}
                                        className={`sugar-btn ${removedIngredients.includes(ingredient) ? 'active' : ''}`}
                                        style={{
                                            backgroundColor: removedIngredients.includes(ingredient) ? '#d9534f' : '',
                                            color: removedIngredients.includes(ingredient) ? 'white' : '',
                                            borderColor: removedIngredients.includes(ingredient) ? '#d9534f' : ''
                                        }}
                                        onClick={() => toggleIngredient(ingredient)}
                                    >
                                        Χωρίς {ingredient}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

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
