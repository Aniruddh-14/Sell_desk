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
    const [currentTime, setCurrentTime] = useState('');
    const notifRef = useRef(null);

    /* Fetch dashboard data for notifications */
    useEffect(() => {
        if (user) {
            getDashboard().then(setDashData).catch(() => { });
        }
    }, [user]);

    /* Clock */
    useEffect(() => {
        const updateClock = () => {
            const n = new Date();
            const h = n.getHours(), m = n.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hh = h % 12 || 12;
            setCurrentTime(`${hh}:${String(m).padStart(2,'0')} ${ampm} IST`);
        };
        updateClock();
        const timer = setInterval(updateClock, 30000);
        return () => clearInterval(timer);
    }, []);

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
            // Future Tabs placeholders
            case 'ads': return <div className="page active"><div className="page-header"><div className="page-title">Ad Studio</div></div><div className="card">Ad Studio is coming soon...</div></div>;
            case 'franchise': return <div className="page active"><div className="page-header"><div className="page-title">Franchise HQ</div></div><div className="card">Franchise HQ coming soon...</div></div>;
            case 'website': return <div className="page active"><div className="page-header"><div className="page-title">Website Builder</div></div><div className="card">Website Builder coming soon...</div></div>;
            case 'pricing': return <div className="page active"><div className="page-header"><div className="page-title">Pricing Plans</div></div><div className="card">Pricing Plans coming soon...</div></div>;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="app-layout">
            <div className="topbar">
                <div className="logo-wrap">
                    <div className="logo-mark">SD</div>
                    <div>
                        <div className="logo-text">SellDesk</div>
                        <div className="logo-sub">SMART RETAIL INTELLIGENCE</div>
                    </div>
                </div>
                <div className="topbar-right">
                    <div className="top-badge green">☁ Cloud Sync Active</div>
                    <div className="top-badge">GST Ready</div>
                    <select id="store-select" style={{width:'auto',fontSize:'11px',padding:'5px 10px',background:'var(--navy3)',borderColor:'var(--border2)',color:'var(--text2)',borderRadius:'20px'}}>
                        <option>Retail Store</option>
                        <option>Cafe / Restaurant</option>
                        <option>Supermarket</option>
                        <option>Pharmacy</option>
                    </select>
                    <div className="time-chip" id="live-clock">{currentTime}</div>

                    {/* ── Bell Icon + Dropdown ── */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            style={{
                                position: 'relative', width: 34, height: 34, borderRadius: 8,
                                background: showNotifs ? 'var(--navy3)' : 'var(--navy4)',
                                border: '1px solid var(--border)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', marginLeft: '10px'
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={showNotifs ? 'var(--gold)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {notifications.length > 0 && (
                                <span style={{
                                    position: 'absolute', top: -3, right: -3,
                                    width: 16, height: 16, borderRadius: '50%',
                                    background: 'var(--red)', color: '#fff',
                                    fontSize: '0.6rem', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* ── Notification Dropdown Overlay ── */}
                        {showNotifs && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                                width: 380, maxHeight: 480, overflowY: 'auto',
                                background: 'var(--navy3)', borderRadius: 14,
                                border: '1px solid var(--border)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                zIndex: 1000, padding: '0',
                                color: 'var(--text)'
                            }}>
                                <div style={{
                                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                                        Smart Inventory Alerts
                                    </span>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 10,
                                        background: 'var(--card2)',
                                        fontSize: '0.72rem', fontWeight: 600, color: 'var(--text2)',
                                    }}>
                                        {notifications.length} new
                                    </span>
                                </div>
                                <div style={{ padding: '0.5rem' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text3)', fontSize: '0.88rem' }}>
                                            All clear — no alerts right now
                                        </div>
                                    ) : notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                                padding: '0.85rem 0.75rem', borderRadius: 10,
                                                background: 'var(--card)', border: '1px solid var(--border)',
                                                marginBottom: 4, cursor: 'default'
                                            }}
                                        >
                                            <div style={{
                                                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                                background: n.color + '20', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%', background: n.color,
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)' }}>{n.title}</span>
                                                    <span style={{ fontSize: '0.68rem', color: 'var(--text3)', flexShrink: 0, marginLeft: 8 }}>{n.time}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5 }}>{n.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button
                        className="btn btn-ghost"
                        onClick={() => signOut()}
                        style={{ marginLeft: '4px', padding: '6px 12px' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} dashData={dashData} />
            <div className="main">
                {renderPage()}
            </div>
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
