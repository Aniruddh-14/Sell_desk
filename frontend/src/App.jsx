import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadInvoice from './components/UploadInvoice';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';
import CompareBills from './components/CompareBills';
import GenerateInvoice from './components/GenerateInvoice';
import ReportsITR from './components/ReportsITR';
import ReconciliationPage from './components/ReconciliationPage';
import CalendarPage from './components/CalendarPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import { getDashboard } from './api/client';

/* ── Notification generator (uses dashboard data) ── */
function generateNotifications(data) {
    if (!data) return [];
    const notes = [];
    const now = new Date();

    const lowStock = data.top_selling?.filter(p => p.quantity < 20) || [];
    if (lowStock.length > 0) {
        notes.push({
            id: 'low-stock', priority: 'high', time: 'Now',
            title: 'Low Stock Alert',
            body: `${lowStock.map(p => p.name).join(', ')} — below 20 units. Reorder soon.`,
            color: '#8B3A3A', bg: 'rgba(139,58,58,0.06)',
        });
    }

    const topSellers = data.top_selling?.slice(0, 3) || [];
    if (topSellers.length > 0) {
        notes.push({
            id: 'restock-top', priority: 'medium', time: '1h ago',
            title: 'Restock Best Sellers',
            body: `Keep ${topSellers.map(p => p.name).join(', ')} well-stocked — highest revenue drivers.`,
            color: '#6D8196', bg: 'rgba(109,129,150,0.06)',
        });
    }

    const slowItems = data.slow_moving?.slice(0, 2) || [];
    if (slowItems.length > 0) {
        notes.push({
            id: 'slow-movers', priority: 'low', time: '2h ago',
            title: 'Slow Movers — Run Promotions',
            body: `${slowItems.map(p => p.name).join(' and ')} are underperforming. Try bundled deals.`,
            color: '#4A4A4A', bg: 'rgba(74,74,74,0.04)',
        });
    }

    const dow = now.getDay();
    if (dow === 4 || dow === 5) {
        notes.push({
            id: 'weekend-prep', priority: 'medium', time: 'Today',
            title: 'Weekend Prep',
            body: 'Snacks & beverages spike on weekends — stock up by Friday evening.',
            color: '#8A9BAC', bg: 'rgba(109,129,150,0.05)',
        });
    }

    const topCat = data.category_distribution?.sort((a, b) => b.count - a.count)[0];
    if (topCat) {
        notes.push({
            id: 'top-category', priority: 'low', time: '3h ago',
            title: `${topCat.category} is #1`,
            body: `${topCat.count} products in ${topCat.category}. Prioritize supplier orders here.`,
            color: '#566A7A', bg: 'rgba(86,106,122,0.05)',
        });
    }

    return notes;
}

function MainApp() {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNotifs, setShowNotifs] = useState(false);
    const [dashData, setDashData] = useState(null);
    const notifRef = useRef(null);

    /* Fetch dashboard data for notifications */
    useEffect(() => {
        if (user) {
            getDashboard().then(setDashData).catch(() => { });
        }
    }, [user]);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (!user) return <Auth />;

    const notifications = generateNotifications(dashData);

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'upload': return <UploadInvoice />;
            case 'data': return <DataTable />;
            case 'compare': return <CompareBills />;
            case 'generate': return <GenerateInvoice />;
            case 'reconciliation': return <ReconciliationPage />;
            case 'calendar': return <CalendarPage />;
            case 'insights': return <InsightsPanel />;
            case 'reports': return <ReportsITR />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="main-content">
                {/* ── Top Bar: Notification Bell + Logout ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(74,74,74,0.08)',
                }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {user.email}
                    </span>

                    {/* ── Bell Icon + Dropdown ── */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            style={{
                                position: 'relative', width: 38, height: 38, borderRadius: 10,
                                background: showNotifs ? 'rgba(109,129,150,0.12)' : 'rgba(74,74,74,0.06)',
                                border: '1px solid rgba(74,74,74,0.1)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={showNotifs ? '#6D8196' : '#6B6B6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {notifications.length > 0 && (
                                <span style={{
                                    position: 'absolute', top: -3, right: -3,
                                    width: 18, height: 18, borderRadius: '50%',
                                    background: '#6D8196', color: '#FFFFE3',
                                    fontSize: '0.6rem', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid var(--bg-primary)',
                                }}>
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* ── Notification Dropdown Overlay ── */}
                        {showNotifs && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                width: 380, maxHeight: 480, overflowY: 'auto',
                                background: '#FFFFE3', borderRadius: 14,
                                border: '1px solid rgba(74,74,74,0.1)',
                                boxShadow: '0 20px 60px rgba(74,74,74,0.18), 0 4px 12px rgba(74,74,74,0.08)',
                                zIndex: 1000, padding: '0',
                            }}>
                                {/* Dropdown header */}
                                <div style={{
                                    padding: '1rem 1.25rem', borderBottom: '1px solid rgba(74,74,74,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#4A4A4A' }}>
                                        Smart Inventory Alerts
                                    </span>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 10,
                                        background: 'rgba(109,129,150,0.1)',
                                        fontSize: '0.72rem', fontWeight: 600, color: '#6D8196',
                                    }}>
                                        {notifications.length} new
                                    </span>
                                </div>

                                {/* Notifications list */}
                                <div style={{ padding: '0.5rem' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9A9A9A', fontSize: '0.88rem' }}>
                                            All clear — no alerts right now
                                        </div>
                                    ) : notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                                padding: '0.85rem 0.75rem', borderRadius: 10,
                                                background: n.bg,
                                                marginBottom: 4, cursor: 'default',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(109,129,150,0.08)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = n.bg}
                                        >
                                            <div style={{
                                                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                                background: `${n.color}18`, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%', background: n.color,
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#4A4A4A' }}>{n.title}</span>
                                                    <span style={{ fontSize: '0.68rem', color: '#9A9A9A', flexShrink: 0, marginLeft: 8 }}>{n.time}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B6B6B', lineHeight: 1.5 }}>{n.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Logout Button ── */}
                    <button
                        onClick={() => signOut()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1.1rem', borderRadius: '8px',
                            background: 'rgba(74,74,74,0.06)',
                            border: '1px solid rgba(74,74,74,0.12)',
                            color: 'var(--text-secondary)', fontSize: '0.84rem',
                            fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
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
