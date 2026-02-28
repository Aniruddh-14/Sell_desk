import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadInvoice from './components/UploadInvoice';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';
import CompareBills from './components/CompareBills';
import GenerateInvoice from './components/GenerateInvoice';
import ReportsITR from './components/ReportsITR';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';

function MainApp() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Protect the app
    if (!user) {
        return <Auth />;
    }

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'upload':
                return <UploadInvoice />;
            case 'data':
                return <DataTable />;
            case 'compare':
                return <CompareBills />;
            case 'generate':
                return <GenerateInvoice />;
            case 'insights':
                return <InsightsPanel />;
            case 'reports':
                return <ReportsITR />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="main-content">
                <div className="page-content">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}
