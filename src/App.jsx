import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/admin/DashboardPage';
import HistoryPage from './pages/admin/HistoryPage';
import OrderPage from './pages/ordering/OrderPage';
import CheckoutPage from './pages/ordering/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import OrderSuccessPage from './pages/ordering/OrderSuccessPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { session, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<OrderPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/history"
                        element={
                            <ProtectedRoute>
                                <HistoryPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
