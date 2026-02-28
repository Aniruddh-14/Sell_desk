import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadInvoice from './components/UploadInvoice';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';
import CompareBills from './components/CompareBills';
import GenerateInvoice from './components/GenerateInvoice';
import ReportsITR from './components/ReportsITR';
import ReconciliationPage from './components/ReconciliationPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';

function MainApp() {
    const { user, signOut } = useAuth();
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
            case 'reconciliation':
                return <ReconciliationPage />;
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
                {/* ── Top Bar with Logout ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    gap: '1rem', marginBottom: '1rem', paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(74,74,74,0.08)',
                }}>
                    <span style={{
                        fontSize: '0.85rem', color: 'var(--text-muted)',
                        fontWeight: 500,
                    }}>
                        {user.email}
                    </span>
                    <button
                        onClick={() => signOut()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1.1rem', borderRadius: '8px',
                            background: 'rgba(74,74,74,0.06)',
                            border: '1px solid rgba(74,74,74,0.12)',
                            color: 'var(--text-secondary)', fontSize: '0.84rem',
                            fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(109,129,150,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(109,129,150,0.25)';
                            e.currentTarget.style.color = '#4A4A4A';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(74,74,74,0.06)';
                            e.currentTarget.style.borderColor = 'rgba(74,74,74,0.12)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
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
