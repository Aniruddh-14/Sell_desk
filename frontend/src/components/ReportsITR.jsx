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
                     <div>
                         <div className="page-eyebrow">Financial Dashboard</div>
                         <div className="page-title">Reports & ITR</div>
                     </div>
                 </div>
                 <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                     <div style={{ color: 'var(--text3)' }}>Compiling financial statements...</div>
                 </div>
            </div>
        );
    }

    if (!report) {
        return (
             <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                 <div style={{ color: 'var(--text3)' }}>No data available</div>
             </div>
        );
    }

    const getCategoryClass = (cat) => {
        if (!cat) return 'tag';
        const str = cat.toLowerCase();
        if (str.includes('food') || str.includes('grocery')) return 'tag tag-green';
        if (str.includes('electronics')) return 'tag tag-blue';
        if (str.includes('health') || str.includes('pharmacy')) return 'tag tag-red';
        return 'tag tag-gold';
    };

    return (
        <div>
            <div className="page-header">
                <div>
                     <div className="page-eyebrow">Financial Dashboard</div>
                     <div className="page-title">Reports & ITR</div>
                </div>
                <div className="page-actions">
                    <button className="btn btn-gold" onClick={exportITRPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export Statement
                    </button>
                </div>
            </div>

            <div className="grid3" style={{ marginBottom: '24px' }}>
                <div className="metric-card">
                    <div className="metric-label">Total Expense / Purchases</div>
                    <div className="metric-val" style={{ color: 'var(--red)' }}>₹{report.total_purchase_value?.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: 8 }}>Based on extracted invoices</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Estimated Input GST Credit (18%)</div>
                    <div className="metric-val" style={{ color: 'var(--gold)' }}>₹{report.estimated_gst_input_credit?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: 8 }}>Potential GST savings</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Items Acquired</div>
                    <div className="metric-val" style={{ color: 'var(--text)' }}>{report.total_items_purchased?.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: 8 }}>Across all suppliers</div>
                </div>
            </div>

            <div className="grid2">
                <div className="card">
                    <div className="card-title">Major Suppliers (Top Expenses)</div>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th style={{ textAlign: 'right' }}>Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.supplier_breakdown?.slice(0, 10).map((sup, idx) => (
                                    <tr key={idx}>
                                        <td style={{ color: 'var(--text)', fontWeight: 500 }}>{sup.supplier}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                                            ₹{sup.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">Expenses by Category</div>
                    <div className="table-wrap">
                        <table>
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
                                            <span className={getCategoryClass(cat.category)}>
                                                {cat.category}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
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
