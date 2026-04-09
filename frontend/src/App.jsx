import React, { useState, useEffect, useRef, useContext } from 'react';
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
import AdStudioPage from './components/AdStudioPage';
import FranchiseHQPage from './components/FranchiseHQPage';
import WebsiteBuilderPage from './components/WebsiteBuilderPage';
import PricingPlansPage from './components/PricingPlansPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
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
    const { user, signOut } = useContext(AuthContext);
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
            case 'ads': return <AdStudioPage />;
            case 'franchise': return <FranchiseHQPage />;
            case 'website': return <WebsiteBuilderPage />;
            case 'pricing': return <PricingPlansPage />;
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
                        <div className="logo-sub">Smart Retail Intelligence</div>
                    </div>
                </div>

                <div className="topbar-center">
                    <div className="top-badge green">
                        <span className="status-dot" />
                        Cloud Sync Active
                    </div>
                    <div className="top-badge blue">GST Ready</div>
                </div>

                <div className="topbar-right">
                    <div className="time-chip" id="live-clock">{currentTime}</div>

                    <div ref={notifRef} className="notif-wrap">
                        <button
                            className={`notif-btn ${showNotifs ? 'active' : ''}`}
                            onClick={() => setShowNotifs(!showNotifs)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {notifications.length > 0 && (
                                <span className="notif-dot">{notifications.length}</span>
                            )}
                        </button>

                        {showNotifs && (
                            <div className="notif-dropdown">
                                <div className="notif-header">
                                    <span>Smart Inventory Alerts</span>
                                    <span className="notif-count">{notifications.length} new</span>
                                </div>
                                <div className="notif-list">
                                    {notifications.length === 0 ? (
                                        <div className="notif-empty">
                                            All clear — no alerts right now
                                        </div>
                                    ) : notifications.map((n) => (
                                        <div key={n.id} className="notif-item">
                                            <div
                                                className="notif-icon"
                                                style={{ background: `${n.color}20` }}
                                            >
                                                <div
                                                    className="notif-icon-dot"
                                                    style={{ background: n.color }}
                                                />
                                            </div>
                                            <div className="notif-copy">
                                                <div className="notif-item-head">
                                                    <span className="notif-title">{n.title}</span>
                                                    <span className="notif-time">{n.time}</span>
                                                </div>
                                                <p className="notif-body">{n.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="signout-btn" onClick={() => signOut()}>
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="layout-shell">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} dashData={dashData} />
                <div className="main">
                    {renderPage()}
                </div>
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
