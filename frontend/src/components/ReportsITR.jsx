import React, { useState, useEffect } from 'react';
import { getITRReport, exportITRPDF } from '../api/client';

export default function ReportsITR() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {
        try {
            const data = await getITRReport();
            setReport(data);
        } catch (err) {
            console.error('Failed to load ITR report:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h2>Reports & ITR</h2>
                    <p>Compiling financial statements...</p>
                </div>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="empty-state">
                <h3>No data available</h3>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Reports & ITR</h2>
                    <p>Advanced financial dashboard for Income Tax Return (ITR) estimates</p>
                </div>
                <button className="btn btn-primary" onClick={exportITRPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export Statement (PDF)
                </button>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card animate-in" style={{ borderTopColor: 'var(--accent-rose)' }}>
                    <div className="stat-label">Total Expense / Purchases</div>
                    <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>₹{report.total_purchase_value?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Based on extracted invoices</div>
                </div>
                <div className="glass-card stat-card animate-in" style={{ borderTopColor: 'var(--accent-indigo)' }}>
                    <div className="stat-label">Estimated Input GST Credit (18%)</div>
                    <div className="stat-value" style={{ color: 'var(--accent-indigo)' }}>₹{report.estimated_gst_input_credit?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Potential GST savings</div>
                </div>
                <div className="glass-card stat-card animate-in" style={{ borderTopColor: 'var(--accent-teal)' }}>
                    <div className="stat-label">Total Items Acquired</div>
                    <div className="stat-value">{report.total_items_purchased?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Across all suppliers</div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginTop: 32 }}>
                <div className="glass-card animate-in">
                    <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
                        Major Suppliers (Top Expenses)
                    </h3>
                    <div className="data-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th style={{ textAlign: 'right' }}>Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.supplier_breakdown?.slice(0, 10).map((sup, idx) => (
                                    <tr key={idx}>
                                        <td>{sup.supplier}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent-rose)' }}>
                                            ₹{sup.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card animate-in">
                    <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-sky)' }}></span>
                        Expenses by Category
                    </h3>
                    <div className="data-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th style={{ textAlign: 'right' }}>Investment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.category_breakdown?.map((cat, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <span className={`category-badge ${cat.category.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {cat.category}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                            ₹{cat.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    );
}
