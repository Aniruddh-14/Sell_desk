import React from 'react';
import {
    LayoutDashboard,
    Upload,
    Database,
    Sparkles,
    Store,
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Invoice', icon: Upload },
    { id: 'data', label: 'Product Data', icon: Database },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
];

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>✦ RetailIQ</h1>
                <p>Smart Store Analytics</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
                        >
                            <Icon className="nav-icon" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <p>Powered by Gemini AI + vLLM OCR</p>
            </div>
        </aside>
    );
}
