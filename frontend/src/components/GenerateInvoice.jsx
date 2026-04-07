import React, { useState } from 'react';

export default function GenerateInvoice() {
    /* ── Store / Business Details (editable) ── */
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [storeGSTIN, setStoreGSTIN] = useState('');

    /* ── Invoice items ── */
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
        <div>
            {/* Inline CSS just for printing */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #print-section, #print-section * { visibility: visible; color: #000 !important; }
                    #print-section { position: absolute; left: 0; top: 0; width: 100%; background: white !important; padding: 20px; }
                    .no-print { display: none !important; }
                    .print-only { display: inline !important; }
                }
            `}</style>

            <div className="page-header no-print">
                <div>
                    <div className="page-eyebrow">Point of Sale</div>
                    <div className="page-title">Billing Desk</div>
                </div>
            </div>

            <div className="pos-layout no-print">
                {/* ── Left form column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="card">
                        <div className="card-title">Business Header</div>
                        <div className="input-group">
                            <label className="input-label">Store / Business Name</label>
                            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. FinSight Store" />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Address</label>
                            <input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} placeholder="e.g. 42 MG Road, Bengaluru" />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">GSTIN</label>
                            <input value={storeGSTIN} onChange={(e) => setStoreGSTIN(e.target.value)} placeholder="e.g. 29ABCDE1234F1ZK" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title">Add Item</div>
                        <form onSubmit={handleAddItem}>
                            <div className="input-group">
                                <label className="input-label">Product Name</label>
                                <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="e.g. Parle-G Biscuit" />
                            </div>
                            <div className="grid2">
                                <div className="input-group">
                                    <label className="input-label">Quantity</label>
                                    <input type="number" min="1" value={qtyInput} onChange={e => setQtyInput(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Unit Price (₹)</label>
                                    <input type="number" step="0.01" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="0.00" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '8px' }}>Add to Bill</button>
                        </form>
                    </div>
                </div>

                {/* ── Center: Bill Panel ── */}
                <div className="bill-panel">
                    <div className="bill-header">
                        Current Bill <span className="tag tag-gold" style={{ fontSize: '10px' }}>Walk-in</span>
                    </div>

                    <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
                        {items.length === 0 ? (
                            <div style={{ margin: 'auto', color: 'var(--text3)', fontSize: '12px', textAlign: 'center' }}>No items added yet</div>
                        ) : (
                            items.map(item => (
                                <div className="bill-item-row" key={item.id}>
                                    <div className="bill-item-name">{item.name}</div>
                                    <div className="qty-ctrl">
                                        <button className="qty-btn" onClick={() => removeItem(item.id)}>×</button>
                                    </div>
                                    <div className="bill-qty">x{item.qty}</div>
                                    <div className="bill-price">₹{(item.qty * item.price).toFixed(2)}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>
                            <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text2)' }}>
                            <span>GST (18%)</span><span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="bill-total">
                            <span className="bill-total-label">Total</span>
                            <span className="bill-total-val">₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Right Action Column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                     <button className="btn btn-green" onClick={handlePrint} disabled={items.length === 0} style={{ padding: '16px', fontSize: '14px' }}>
                        Print Receipt
                    </button>
                    <button className="btn" disabled={items.length === 0}>Send via SMS</button>
                    <button className="btn" disabled={items.length === 0}>Save PDF</button>

                    <div className="divider"></div>

                    <div className="input-group">
                        <label className="input-label">Customer Details</label>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Name or Mobile" />
                    </div>
                </div>
            </div>

            {/* ── Hidden Print Layout ── */}
            <div id="print-section" style={{ display: 'none', background: 'white !important', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ccc', paddingBottom: 20, marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>
                            {storeName || 'Your Business Name'}
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{storeAddress || 'Business Address'}</p>
                        {(storeGSTIN || !storeName) && (
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>GSTIN: {storeGSTIN || '—'}</p>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>INVOICE</h2>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</p>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Bill To: {customerName}</p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '12px 0' }}>Item</th>
                            <th style={{ textAlign: 'center', padding: '12px 0' }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '12px 0' }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '12px 0' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px 0' }}>No items added yet</td></tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px 0' }}>{item.name}</td>
                                    <td style={{ textAlign: 'center', padding: '12px 0' }}>{item.qty}</td>
                                    <td style={{ textAlign: 'right', padding: '12px 0' }}>₹{item.price.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', padding: '12px 0' }}>₹{(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: 300 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span>Estimated GST (18%):</span><span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 8, borderTop: '2px solid #ccc', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Grand Total:</span><span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
