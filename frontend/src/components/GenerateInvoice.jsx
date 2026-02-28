import React, { useState } from 'react';

export default function GenerateInvoice() {
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [items, setItems] = useState([]);
    const [nameInput, setNameInput] = useState('');
    const [qtyInput, setQtyInput] = useState(1);
    const [priceInput, setPriceInput] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!nameInput || !priceInput) return;

        setItems([...items, {
            id: Date.now(),
            name: nameInput,
            qty: Number(qtyInput),
            price: Number(priceInput)
        }]);

        setNameInput('');
        setQtyInput(1);
        setPriceInput('');
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.18; // 18% GST assumption
    const total = subtotal + tax;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="generate-invoice-container">
            {/* Inline CSS just for printing */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-section, #print-section * {
                        visibility: visible;
                        color: #000 !important;
                    }
                    #print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                        padding: 20px;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="page-header no-print">
                <h2>Generate Invoice</h2>
                <p>Create outbound POS bills for your customers</p>
            </div>

            <div className="glass-card animate-in no-print" style={{ marginBottom: 24 }}>
                <h3>Add Item to Bill</h3>
                <form onSubmit={handleAddItem} style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Product Name</label>
                        <input
                            className="form-input"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            placeholder="e.g. Parle-G Biscuit"
                        />
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Quantity</label>
                        <input
                            type="number" min="1" className="form-input"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={qtyInput}
                            onChange={e => setQtyInput(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '1 1 120px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Unit Price (₹)</label>
                        <input
                            type="number" step="0.01" className="form-input"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', color: 'white' }}
                            value={priceInput}
                            onChange={e => setPriceInput(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', height: 42 }}>
                        Add to Bill
                    </button>
                </form>
            </div>

            <div className="glass-card animate-in print-wrapper" id="print-section" style={{ background: 'var(--bg-secondary)', padding: 40, borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-glass)', paddingBottom: 20, marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px', color: 'var(--accent-indigo)' }}>RETAILIQ STORE</h2>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>123 Market Street, Business District</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>GSTIN: 22AAAAA0000A1Z5</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>INVOICE</h2>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bill To:
                            <input
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                className="no-print"
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent-teal)', borderBottom: '1px dashed var(--accent-teal)', marginLeft: 8, outline: 'none' }}
                            />
                            <span className="print-only" style={{ display: 'none', color: 'var(--text-primary)' }}>{customerName}</span>
                        </p>
                    </div>
                </div>

                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
                            <th style={{ textAlign: 'left', padding: '12px 0', color: 'var(--text-muted)' }}>Item</th>
                            <th style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)' }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '12px 0', color: 'var(--text-muted)' }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '12px 0', color: 'var(--text-muted)' }}>Total</th>
                            <th className="no-print" style={{ width: 40 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>No items added yet</td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '12px 0' }}>{item.name}</td>
                                    <td style={{ textAlign: 'center', padding: '12px 0' }}>{item.qty}</td>
                                    <td style={{ textAlign: 'right', padding: '12px 0' }}>₹{item.price.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', padding: '12px 0' }}>₹{(item.qty * item.price).toFixed(2)}</td>
                                    <td className="no-print" style={{ textAlign: 'right', padding: '12px 0' }}>
                                        <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: 300 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--text-secondary)' }}>
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--text-secondary)' }}>
                            <span>Estimated GST (18%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 8, borderTop: '2px solid var(--border-glass)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Grand Total:</span>
                            <span style={{ color: 'var(--accent-emerald)' }}>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ marginTop: 40, textAlign: 'right' }}>
                    <button className="btn btn-success" onClick={handlePrint} disabled={items.length === 0}>
                        Print / Save as PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
