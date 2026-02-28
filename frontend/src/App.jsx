import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadInvoice from './components/UploadInvoice';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'upload':
                return <UploadInvoice />;
            case 'data':
                return <DataTable />;
            case 'insights':
                return <InsightsPanel />;
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

export default App;
