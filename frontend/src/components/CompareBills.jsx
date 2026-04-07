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
                     <div>
                         <div className="page-eyebrow">Supplier Analytics</div>
                         <div className="page-title">Compare Bills</div>
                     </div>
                 </div>
                 <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                     <div style={{ color: 'var(--text3)' }}>Loading your invoices...</div>
                 </div>
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
                <div>
                     <div className="page-eyebrow">Supplier Analytics</div>
                     <div className="page-title">Compare Bills</div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title">Select Invoices to Compare</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {invoices.length === 0 && <p style={{ color: 'var(--text3)', fontSize: '12px' }}>No invoices found. Please upload bills first.</p>}
                    {invoices.map(inv => (
                        <div
                            key={inv.id}
                            onClick={() => toggleInvoice(inv.id)}
                            style={{
                                padding: '14px 18px',
                                border: `1px solid ${selectedInvoices.includes(inv.id) ? 'var(--gold)' : 'var(--border)'}`,
                                background: selectedInvoices.includes(inv.id) ? 'var(--gold-dim)' : 'var(--card2)',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                flex: '1 1 300px',
                                maxWidth: '100%'
                            }}
                        >
                            <div style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: selectedInvoices.includes(inv.id) ? 'var(--gold)' : 'var(--text)' }}>
                                {inv.filename}
                            </div>
                            <div style={{ margin: 0, fontSize: '11px', color: 'var(--text3)' }}>
                                Supplier: {inv.supplier} • {new Date(inv.upload_date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedInvoices.length > 1 ? (
                <div className="card">
                    <div className="card-title">Price Comparison Matrix</div>
                    {commonProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: '12px' }}>
                            <p>No common products found between the selected invoices.</p>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
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
                                                <td style={{ fontWeight: 500, color: 'var(--text)' }}>{name}</td>
                                                {selectedInvoices.map(id => {
                                                    const price = comparisonData[name][id];
                                                    const isCheapest = price === minPrice;
                                                    return (
                                                        <td key={id} style={{ color: price ? 'var(--text)' : 'var(--text3)' }}>
                                                            {price ? (
                                                                <span style={{ color: isCheapest ? 'var(--green)' : 'inherit', fontWeight: isCheapest ? 600 : 400 }}>
                                                                    ₹{price.toFixed(2)}
                                                                </span>
                                                            ) : '—'}
                                                        </td>
                                                    );
                                                })}
                                                <td style={{ color: diff > 0 ? 'var(--red)' : 'inherit' }}>
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
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="card-title" style={{ margin: '0 0 8px', textAlign: 'center' }}>Waiting for selection</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Select at least 2 invoices above to see a comparison matrix.</div>
                </div>
            )}
        </div>
    );
}
