import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import OrderPage from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OrderPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
