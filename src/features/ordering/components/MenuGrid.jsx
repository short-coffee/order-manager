import React from 'react';

const MenuGrid = ({ items, onAdd }) => {
    return (
        <div className="menu-grid animate-fade-in">
            {items.map(item => (
                <div key={item.id} className="menu-item-card premium-card">
                    <div className="item-image-wrapper">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-category-badge">{item.category}</div>
                    </div>
                    <div className="item-details">
                        <div className="item-main-info">
                            <h3>{item.name}</h3>
                            <span className="item-price">€{item.price.toFixed(2)}</span>
                        </div>
                        <button className="add-btn" onClick={() => onAdd(item)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Προσθήκη
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuGrid;
