import React, { useState, useEffect } from 'react';
import { getITRReport } from '../api/client';

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
            <div className="page-header">
                <h2>Reports & ITR</h2>
                <p>Advanced financial dashboard for Income Tax Return (ITR) estimates</p>
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

            <div className="glass-card animate-in" style={{ marginTop: 24, padding: 30, background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))' }}>
                <h3 style={{ marginBottom: 12 }}>Download Full ITR Report</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Export a complete CA-ready financial statement detailing all expenses, supplier payments, and GST credit estimations required for quarterly filings.</p>
                <button className="btn btn-primary" onClick={() => window.print()}>Export Statement (PDF)</button>
            </div>
        </div>
    );
}
