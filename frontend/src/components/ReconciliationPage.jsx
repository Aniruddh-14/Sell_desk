import React, { useState, useCallback } from 'react';
import { uploadPaymentRecords, runReconciliation, getPaymentRecords } from '../api/client';

const STATUS_CONFIG = {
    matched: { color: 'var(--green)', bg: 'rgba(46,196,160,0.1)', icon: '✅', label: 'Matched' },
    mismatched: { color: 'var(--red)', bg: 'rgba(224,92,92,0.1)', icon: '⚠️', label: 'Mismatched' },
    missing_invoice: { color: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', icon: '📄', label: 'Missing Invoice' },
    missing_payment: { color: 'var(--text)', bg: 'var(--navy3)', icon: '💰', label: 'Missing Payment' },
    duplicate: { color: 'var(--text2)', bg: 'var(--navy4)', icon: '🔁', label: 'Duplicate' },
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
            setUploadMsg(`Uploaded ${data.count} payment records`);
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
                <div>
                     <div className="page-eyebrow">Financial Tools</div>
                     <div className="page-title">Invoice Reconciliation</div>
                </div>
            </div>

            {/* Upload + Actions Row */}
            <div className="grid2" style={{ marginBottom: '24px' }}>
                {/* Upload Payment Records */}
                <div className="card">
                    <div className="card-title">Upload Payment Records</div>
                    <p style={{ color: 'var(--text3)', fontSize: '13px', marginBottom: '16px' }}>
                        Upload a CSV file with columns: <code style={{ color: 'var(--gold)' }}>vendor, amount, date, reference</code>
                    </p>
                    <label
                        htmlFor="payment-csv"
                        className="btn"
                        style={{ cursor: 'pointer', opacity: uploading ? 0.6 : 1, display: 'inline-flex' }}
                    >
                        {uploading ? '⏳ Uploading...' : '📂 Choose CSV File'}
                        <input id="payment-csv" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                    {uploadMsg && <p style={{ color: 'var(--green)', marginTop: '12px', fontSize: '13px' }}>{uploadMsg}</p>}
                    {paymentCount > 0 && <p style={{ color: 'var(--text3)', marginTop: '8px', fontSize: '12px' }}>
                        {paymentCount} payment records loaded
                    </p>}
                </div>

                {/* Run Reconciliation */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div className="card-title">⚡ Run Reconciliation</div>
                    <p style={{ color: 'var(--text3)', fontSize: '13px', marginBottom: '20px' }}>
                        Matches your uploaded invoices against payment records using fuzzy vendor matching and amount tolerance
                    </p>
                    <button
                        className="btn btn-gold"
                        onClick={handleReconcile}
                        disabled={reconciling}
                        style={{ opacity: reconciling ? 0.6 : 1, padding: '12px 24px' }}
                    >
                        {reconciling ? 'Analyzing...' : 'Run Reconciliation'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-red" style={{ marginBottom: '24px' }}>
                    <span className="alert-icon">⚠</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Report Summary */}
            {report && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        {[
                            { label: 'Invoices', value: report.total_invoices, icon: '📄', color: 'var(--text)' },
                            { label: 'Payments', value: report.total_payments, icon: '💰', color: 'var(--text)' },
                            { label: 'Matched', value: report.matched, icon: '✅', color: 'var(--green)' },
                            { label: 'Mismatched', value: report.mismatched, icon: '⚠️', color: 'var(--red)' },
                            { label: 'Missing Inv.', value: report.missing_invoices, icon: '🔍', color: 'var(--gold)' },
                            { label: 'Duplicates', value: report.duplicates, icon: '🔁', color: 'var(--text2)' },
                        ].map((stat, i) => (
                            <div key={i} className="metric-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{stat.icon}</div>
                                <div className="metric-val" style={{ color: stat.color }}>{stat.value}</div>
                                <div className="metric-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Amount Summary */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text2)', fontSize: '12px', textTransform: 'uppercase' }}>Total Invoice Amount</div>
                                <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', marginTop: '8px' }}>₹{report.total_invoice_amount?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text2)', fontSize: '12px', textTransform: 'uppercase' }}>Total Payment Expected</div>
                                <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', marginTop: '8px' }}>₹{report.total_payment_amount?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text2)', fontSize: '12px', textTransform: 'uppercase' }}>Discrepancy</div>
                                <div style={{
                                    fontSize: '24px', fontWeight: '600', marginTop: '8px',
                                    color: report.amount_discrepancy === 0 ? 'var(--green)' : 'var(--red)'
                                }}>₹{Math.abs(report.amount_discrepancy || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Results Table */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: '16px' }}>📊 Reconciliation Details</div>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Invoice</th>
                                        <th>Supplier/Vendor</th>
                                        <th>Invoice Amt</th>
                                        <th>Expected Amt</th>
                                        <th>Difference</th>
                                        <th>Confidence</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.items?.map((item, idx) => {
                                        const cfg = STATUS_CONFIG[item.status] || { color: 'var(--text3)', bg: 'transparent', icon: '❓', label: item.status };
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '4px 8px', borderRadius: '4px',
                                                        background: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: '600'
                                                    }}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text)' }}>
                                                    {item.invoice_filename || '—'}
                                                </td>
                                                <td>
                                                    {item.invoice_supplier || item.payment_vendor || '—'}
                                                </td>
                                                <td style={{ fontFamily: 'var(--font-mono)' }}>
                                                    {item.invoice_amount ? `₹${item.invoice_amount.toLocaleString()}` : '—'}
                                                </td>
                                                <td style={{ fontFamily: 'var(--font-mono)' }}>
                                                    {item.payment_amount ? `₹${item.payment_amount.toLocaleString()}` : '—'}
                                                </td>
                                                <td style={{
                                                    fontFamily: 'var(--font-mono)', fontWeight: '600',
                                                    color: item.amount_diff === 0 ? 'var(--green)' : item.amount_diff > 0 ? 'var(--gold)' : 'var(--red)'
                                                }}>
                                                    {item.amount_diff !== 0 ? `₹${item.amount_diff.toLocaleString()}` : '—'}
                                                </td>
                                                <td>
                                                    {item.confidence > 0 ? `${Math.round(item.confidence * 100)}%` : '—'}
                                                </td>
                                                <td style={{ maxWidth: '250px', fontSize: '12px' }}>
                                                    {item.notes}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {(!report.items || report.items.length === 0) && (
                                <p style={{ textAlign: 'center', color: 'var(--text3)', padding: '32px' }}>
                                    No reconciliation items. Upload invoices and payment records first.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!report && !error && (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚖️</div>
                    <div className="card-title" style={{ margin: '0 0 8px', textAlign: 'center' }}>Ready to Reconcile</div>
                    <div style={{ color: 'var(--text3)', maxWidth: '450px', margin: '0 auto', fontSize: '14px', lineHeight: 1.5 }}>
                        Upload your payment records CSV, then click "Run Reconciliation" to match them against your uploaded invoices.
                    </div>
                </div>
            )}
        </div>
    );
}
