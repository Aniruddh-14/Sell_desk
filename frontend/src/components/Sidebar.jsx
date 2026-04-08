import React from 'react';

const navItems = [
    { id: 'dashboard', label: 'Overview', icon: '◈', num: '01' },
    { id: 'generate', label: 'Billing Desk', icon: '⊟', num: '02' },
    { id: 'data', label: 'Products & Profit', icon: '◉', num: '03' },
    { id: 'upload', label: 'OCR Imports', icon: '⊡', num: '04' },
    { id: 'compare', label: 'Compare Bills', icon: '⊞', num: '05' },
    { id: 'reconciliation', label: 'Reconciliation', icon: '◫', num: '06' },
    { id: 'calendar', label: 'Sales Calendar', icon: '📅', num: '07' },
    { id: 'reports', label: 'Reports & ITR', icon: '📄', num: '08' },
    { id: 'insights', label: 'AI Insights', icon: '⊛', num: '09' },
    { id: 'ads', label: 'Ad Studio', icon: '◎', num: '10' },
    { id: 'franchise', label: 'Franchise HQ', icon: '◈', num: '11' },
    { id: 'website', label: 'Website Builder', icon: '◇', num: '12' },
    { id: 'pricing', label: 'Pricing Plans', icon: '◆', num: '13' },
];

export default function Sidebar({ activeTab, onTabChange, dashData }) {
    const todayRevenue = dashData?.daily_totals?.find(d => d.date === new Date().toISOString().split('T')[0])?.total_revenue || 0;
    const billsProcessed = dashData?.daily_totals?.find(d => d.date === new Date().toISOString().split('T')[0])?.bill_count || 0;

    return (
        <div className="sidebar">
            <div className="sidebar-section-label">Navigation</div>

            {navItems.map((item) => (
                <div
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span> 
                    {item.label}
                </div>
            ))}

            <div className="sidebar-today">
                <div className="today-label">Today</div>
                <div className="today-row">
                    <span>Bills processed</span>
                    <span className="today-val">{billsProcessed}</span>
                </div>
                <div className="today-row">
                    <span>Shop score</span>
                    <span className="today-val gold">88 / 100</span>
                </div>
                <div className="today-row">
                    <span>Revenue</span>
                    <span className="today-val">₹{todayRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="today-row">
                    <span>Support</span>
                    <span className="today-val gold">Priority</span>
                </div>
            </div>
        </div>
    );
}
