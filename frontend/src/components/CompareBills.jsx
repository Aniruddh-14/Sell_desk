import React, { useState, useEffect } from 'react';
import { getInvoices, getProducts } from '../api/client';

export default function CompareBills() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const invRes = await getInvoices();
            setInvoices(invRes.invoices || []);
            const prodRes = await getProducts();
            setProducts(prodRes.products || []);
        } catch (err) {
            console.error('Failed to load data for comparison:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleInvoice = (invId) => {
        setSelectedInvoices(prev =>
            prev.includes(invId) ? prev.filter(id => id !== invId) : [...prev, invId]
        );
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h2>⚖️ Compare Bills</h2>
                    <p>Loading your invoices...</p>
                </div>
                <div className="loading-spinner" />
            </div>
        );
    }

    // Filter products belonging to selected invoices
    const comparisonData = {};

    // Structure: { "ProductName": { invId1: price1, invId2: price2, ... } }
    products.forEach(p => {
        if (selectedInvoices.includes(p.invoice_id) && p.product_name) {
            if (!comparisonData[p.product_name]) {
                comparisonData[p.product_name] = {};
            }
            comparisonData[p.product_name][p.invoice_id] = p.price;
        }
    });

    const commonProducts = Object.keys(comparisonData).filter(
        name => Object.keys(comparisonData[name]).length > 1
    );

    return (
        <div>
            <div className="page-header">
                <h2>⚖️ Compare Bills</h2>
                <p>Select multiple supplier invoices to compare product pricing</p>
            </div>

            <div className="glass-card animate-in" style={{ marginBottom: 24 }}>
                <h3>Select Invoices to Compare</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                    {invoices.length === 0 && <p className="text-muted">No invoices found. Please upload bills first.</p>}
                    {invoices.map(inv => (
                        <div
                            key={inv.id}
                            onClick={() => toggleInvoice(inv.id)}
                            style={{
                                padding: '12px 16px',
                                border: `1px solid ${selectedInvoices.includes(inv.id) ? 'var(--accent-indigo)' : 'var(--border-glass)'}`,
                                background: selectedInvoices.includes(inv.id) ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                flex: '1 1 300px',
                                maxWidth: '100%'
                            }}
                        >
                            <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{inv.filename}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Supplier: {inv.supplier} • {new Date(inv.upload_date).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedInvoices.length > 1 ? (
                <div className="glass-card animate-in">
                    <h3 style={{ marginBottom: 20 }}>Price Comparison Matrix</h3>
                    {commonProducts.length === 0 ? (
                        <div className="empty-state">
                            <p>No common products found between the selected invoices.</p>
                        </div>
                    ) : (
                        <div className="data-table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        {selectedInvoices.map(id => {
                                            const inv = invoices.find(i => i.id === id);
                                            return <th key={id}>{inv ? inv.supplier : 'Unknown'}</th>;
                                        })}
                                        <th>Difference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commonProducts.map(name => {
                                        const prices = selectedInvoices.map(id => comparisonData[name][id]).filter(p => p !== undefined);
                                        const minPrice = Math.min(...prices);
                                        const maxPrice = Math.max(...prices);
                                        const diff = maxPrice - minPrice;

                                        return (
                                            <tr key={name}>
                                                <td style={{ fontWeight: 500 }}>{name}</td>
                                                {selectedInvoices.map(id => {
                                                    const price = comparisonData[name][id];
                                                    const isCheapest = price === minPrice;
                                                    return (
                                                        <td key={id} style={{ color: price ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                                            {price ? (
                                                                <span style={{ color: isCheapest ? 'var(--accent-emerald)' : 'inherit', fontWeight: isCheapest ? 600 : 400 }}>
                                                                    ₹{price.toFixed(2)}
                                                                </span>
                                                            ) : '—'}
                                                        </td>
                                                    );
                                                })}
                                                <td style={{ color: diff > 0 ? 'var(--accent-rose)' : 'inherit' }}>
                                                    {diff > 0 ? `₹${diff.toFixed(2)} Spread` : 'Matched'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>Waiting for selection</h3>
                    <p>Select at least 2 invoices above to see a comparison matrix.</p>
                </div>
            )}
        </div>
    );
}
