import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import OrderList from '../../features/orders/components/OrderList';
import './DashboardPage.css';

const DashboardPage = () => {
    return (
        <MainLayout>
            <div className="animate-fade-in">
                <OrderList />
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
