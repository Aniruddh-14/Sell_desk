import React from 'react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'upload', label: 'Upload Invoice' },
    { id: 'data', label: 'Product Data' },
    { id: 'compare', label: 'Compare Bills' },
    { id: 'generate', label: 'Generate Bill' },
    { id: 'reconciliation', label: 'Reconciliation' },
    { id: 'calendar', label: 'Sales Calendar' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'reports', label: 'Reports & ITR' },
];

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>✦ FinSight-OCR</h1>
                <p>Smart Store Analytics</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    return (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
                        >
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
