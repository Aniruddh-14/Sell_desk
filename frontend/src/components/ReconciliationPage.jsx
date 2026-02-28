import React, { useState, useCallback } from 'react';
import { uploadPaymentRecords, runReconciliation, getPaymentRecords } from '../api/client';

const STATUS_CONFIG = {
    matched: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: '✅', label: 'Matched' },
    mismatched: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '⚠️', label: 'Mismatched' },
    missing_invoice: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '📄', label: 'Missing Invoice' },
    missing_payment: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '💰', label: 'Missing Payment' },
    duplicate: { color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: '🔁', label: 'Duplicate' },
};

export default function ReconciliationPage() {
    const [uploading, setUploading] = useState(false);
    const [reconciling, setReconciling] = useState(false);
    const [report, setReport] = useState(null);
    const [paymentCount, setPaymentCount] = useState(0);
    const [error, setError] = useState('');
    const [uploadMsg, setUploadMsg] = useState('');

    const handleFileUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setError('');
        setUploadMsg('');
        try {
            const data = await uploadPaymentRecords(file);
            setUploadMsg(`✅ Uploaded ${data.count} payment records`);
            setPaymentCount(data.count);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to upload payment records');
        } finally {
            setUploading(false);
        }
    }, []);

    const handleReconcile = useCallback(async () => {
        setReconciling(true);
        setError('');
        try {
            const data = await runReconciliation();
            setReport(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Reconciliation failed');
        } finally {
            setReconciling(false);
        }
    }, []);

    const handleLoadExisting = useCallback(async () => {
        try {
            const data = await getPaymentRecords();
            setPaymentCount(data.total || 0);
        } catch (err) { /* ignore */ }
    }, []);

    React.useEffect(() => { handleLoadExisting(); }, []);

    return (
        <div>
            <div className="page-header">
                <h2>🔍 Invoice Reconciliation</h2>
                <p>Match invoices against expected payment records to detect mismatches, duplicates, and missing entries</p>
            </div>

            {/* Upload + Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Upload Payment Records */}
                <div className="glass-card animate-in">
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        📋 Upload Payment Records
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Upload a CSV file with columns: <code style={{ color: '#a78bfa' }}>vendor, amount, date, reference</code>
                    </p>
                    <label
                        htmlFor="payment-csv"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer',
                            fontSize: '0.9rem', transition: 'opacity 0.2s',
                            opacity: uploading ? 0.6 : 1,
                        }}
                    >
                        {uploading ? '⏳ Uploading...' : '📂 Choose CSV File'}
                        <input id="payment-csv" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                    {uploadMsg && <p style={{ color: '#22c55e', marginTop: '0.75rem', fontSize: '0.9rem' }}>{uploadMsg}</p>}
                    {paymentCount > 0 && <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                        {paymentCount} payment records loaded
                    </p>}
                </div>

                {/* Run Reconciliation */}
                <div className="glass-card animate-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        ⚡ Run Reconciliation
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                        Matches your uploaded invoices against payment records using fuzzy vendor matching and amount tolerance
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleReconcile}
                        disabled={reconciling}
                        style={{
                            padding: '0.875rem 2.5rem', fontSize: '1rem',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            opacity: reconciling ? 0.6 : 1,
                        }}
                    >
                        {reconciling ? '🔄 Analyzing...' : '🔍 Run Reconciliation'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card" style={{ background: 'rgba(239,68,68,0.08)', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem' }}>
                    <span style={{ color: '#fca5a5' }}>❌ {error}</span>
                </div>
            )}

            {/* Report Summary */}
            {report && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Invoices', value: report.total_invoices, icon: '📄', color: '#6366f1' },
                            { label: 'Payments', value: report.total_payments, icon: '💳', color: '#8b5cf6' },
                            { label: 'Matched', value: report.matched, icon: '✅', color: '#22c55e' },
                            { label: 'Mismatched', value: report.mismatched, icon: '⚠️', color: '#f59e0b' },
                            { label: 'Missing Inv.', value: report.missing_invoices, icon: '📄', color: '#ef4444' },
                            { label: 'Duplicates', value: report.duplicates, icon: '🔁', color: '#f97316' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card animate-in" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Amount Summary */}
                    <div className="glass-card animate-in" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Invoice Amount</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>₹{report.total_invoice_amount?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Payment Expected</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>₹{report.total_payment_amount?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Discrepancy</div>
                                <div style={{
                                    fontSize: '1.5rem', fontWeight: '700',
                                    color: report.amount_discrepancy === 0 ? '#22c55e' : '#ef4444'
                                }}>₹{Math.abs(report.amount_discrepancy || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Results Table */}
                    <div className="glass-card animate-in">
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>📊 Reconciliation Details</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        {['Status', 'Invoice', 'Supplier/Vendor', 'Invoice Amt', 'Expected Amt', 'Difference', 'Confidence', 'Notes'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.items?.map((item, idx) => {
                                        const cfg = STATUS_CONFIG[item.status] || { color: '#94a3b8', bg: 'transparent', icon: '❓', label: item.status };
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                                                        background: cfg.bg, color: cfg.color, fontSize: '0.8rem', fontWeight: '600'
                                                    }}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                                                    {item.invoice_filename || '—'}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-primary)' }}>
                                                    {item.invoice_supplier || item.payment_vendor || '—'}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                                                    {item.invoice_amount ? `₹${item.invoice_amount.toLocaleString()}` : '—'}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                                                    {item.payment_amount ? `₹${item.payment_amount.toLocaleString()}` : '—'}
                                                </td>
                                                <td style={{
                                                    padding: '0.75rem 0.5rem', fontWeight: '600',
                                                    color: item.amount_diff === 0 ? '#22c55e' : item.amount_diff > 0 ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {item.amount_diff !== 0 ? `₹${item.amount_diff.toLocaleString()}` : '—'}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                                                    {item.confidence > 0 ? `${Math.round(item.confidence * 100)}%` : '—'}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', maxWidth: '250px', fontSize: '0.8rem' }}>
                                                    {item.notes}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {(!report.items || report.items.length === 0) && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                    No reconciliation items. Upload invoices and payment records first.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!report && !error && (
                <div className="glass-card animate-in" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Ready to Reconcile</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto' }}>
                        Upload your payment records CSV, then click "Run Reconciliation" to match them against your uploaded invoices.
                    </p>
                </div>
            )}
        </div>
    );
}
