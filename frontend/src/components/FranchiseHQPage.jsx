import React from 'react';
import { motion } from 'framer-motion';
import './theme.css';

export default function FranchiseHQPage() {
    return (
        <div style={{ padding: '28px', background: 'var(--cream-bg)', color: 'var(--text-primary)', minHeight: '100vh', margin: '-32px -36px', borderRadius: '10px' }}>
            <div className="section-header">
                <div>
                    <div className="panel-eyebrow">Multi-location View</div>
                    <div className="panel-title">Franchise HQ</div>
                </div>
                <div className="section-header-actions">
                    <button className="new-btn new-btn-outline">Push Price Update</button>
                    <button className="new-btn new-btn-gold">Add Branch</button>
                </div>
            </div>

            <div className="alert-strip">⚠ Wakad branch margin dropped 8 points this week — investigate product mix or billing gaps.</div>

            {/* Summary metrics */}
            <div className="g4" style={{ marginBottom: '16px' }}>
                <div className="new-metric">
                    <div className="new-metric-label">Total Revenue (All)</div>
                    <div className="new-metric-val">₹3.9L</div>
                    <div className="new-metric-sub up">↑ 8% vs last month</div>
                </div>
                <div className="new-metric">
                    <div className="new-metric-label">Network Avg Score</div>
                    <div className="new-metric-val">74</div>
                    <div className="new-metric-sub blue">/ 100 combined</div>
                </div>
                <div className="new-metric">
                    <div className="new-metric-label">Active Branches</div>
                    <div className="new-metric-val">3</div>
                    <div className="new-metric-sub up">+1 onboarding</div>
                </div>
                <div className="new-metric">
                    <div className="new-metric-label">Franchise Earnings</div>
                    <div className="new-metric-val">₹12K</div>
                    <div className="new-metric-sub up">Royalty this month</div>
                </div>
            </div>

            <div className="g2">
                {/* Branch List */}
                <div className="new-card">
                    <div className="new-card-label">Master Dashboard</div>
                    <div className="new-card-title">Branch comparison</div>
                    
                    <div className="branch-row">
                        <div className="branch-info">
                            <span className="branch-name">Pune Central</span>
                            <span className="branch-sub">Koregaon Park · 8 staff</span>
                        </div>
                        <div className="branch-right">
                            <span className="branch-rev">₹1.8L</span>
                            <div className="branch-score-badge high">82</div>
                        </div>
                    </div>
                    
                    <div className="branch-row">
                        <div className="branch-info">
                            <span className="branch-name">Baner</span>
                            <span className="branch-sub">Baner Road · 5 staff</span>
                        </div>
                        <div className="branch-right">
                            <span className="branch-rev">₹1.3L</span>
                            <div className="branch-score-badge mid">74</div>
                        </div>
                    </div>
                    
                    <div className="branch-row">
                        <div className="branch-info">
                            <span className="branch-name">Wakad</span>
                            <span className="branch-sub">Wakad Main · 4 staff</span>
                        </div>
                        <div className="branch-right">
                            <span className="branch-rev">₹98K</span>
                            <div className="branch-score-badge low">67</div>
                        </div>
                    </div>
                    
                    <div className="divider"></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="new-btn new-btn-outline" style={{ flex: 1, fontSize: '12px' }}>Push Price to All</button>
                        <button className="new-btn new-btn-navy" style={{ flex: 1, fontSize: '12px' }}>Broadcast Promo</button>
                    </div>
                </div>

                {/* Onboarding */}
                <div className="new-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div>
                            <div className="new-card-label">Franchise-in-a-Box</div>
                            <div className="new-card-title" style={{ marginBottom: 0 }}>Next outlet onboarding</div>
                        </div>
                        <span className="new-tag amber" style={{ display: 'inline-block' }}>2 approvals pending</span>
                    </div>
                    
                    <div style={{ background: 'var(--cream)', borderRadius: '9px', padding: '14px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', marginBottom: '6px' }}>Hinjawadi outlet — pending approval</div>
                        <div className="onboard-step">
                            <div className="ostep-num">1</div>
                            <div className="ostep-text">Copy pricing and menu from Pune Central.</div>
                        </div>
                        <div className="onboard-step">
                            <div className="ostep-num">2</div>
                            <div className="ostep-text">Auto-build location website for Hinjawadi.</div>
                        </div>
                        <div className="onboard-step">
                            <div className="ostep-num">3</div>
                            <div className="ostep-text">Enable launch campaign pack for first 30 days.</div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="new-btn new-btn-gold" style={{ flex: 1 }}>Approve & Launch</button>
                        <button className="new-btn new-btn-outline" style={{ flex: 1 }}>Request Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}