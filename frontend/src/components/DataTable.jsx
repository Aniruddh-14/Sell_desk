import React, { useState, useEffect } from 'react';
import { getProducts, exportCSV } from '../api/client';

export default function DataTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('product_name');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data.products || []);
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await exportCSV();
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filtered = products
        .filter((p) => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                p.product_name?.toLowerCase().includes(q) ||
                p.supplier?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const getCategoryClass = (cat) => {
        if (!cat) return 'tag';
        const str = cat.toLowerCase();
        if (str.includes('food') || str.includes('grocery')) return 'tag tag-green';
        if (str.includes('electronics')) return 'tag tag-blue';
        if (str.includes('health') || str.includes('pharmacy')) return 'tag tag-red';
        return 'tag tag-gold';
    };

    const sortIndicator = (field) => {
        if (sortField !== field) return '';
        return sortDir === 'asc' ? ' ↑' : ' ↓';
    };

    if (loading) {
        return (
            <div>
                 <div className="page-header">
                     <div>
                         <div className="page-eyebrow">Inventory Database</div>
                         <div className="page-title">Product Data</div>
                     </div>
                 </div>
                 <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                     <div style={{ color: 'var(--text3)' }}>Loading products...</div>
                 </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-eyebrow">Inventory Database</div>
                    <div className="page-title">Products & Profit</div>
                </div>
                <div className="page-actions">
                    <button className="btn btn-ghost" onClick={loadProducts}>Refresh</button>
                    <button className="btn btn-gold" onClick={handleExport}>Export CSV</button>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                     <div className="card-title" style={{ margin: 0 }}>All Products ({products.length})</div>
                     <div className="search-bar" style={{ margin: 0, width: '250px' }}>
                         <span className="search-icon">🔍</span>
                         <input
                             type="text"
                             placeholder="Search inventory..."
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                         />
                     </div>
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                        <div style={{ marginBottom: '8px' }}>No products found</div>
                        <div style={{ fontSize: '12px' }}>{search ? 'Try a different search term' : 'Upload some invoices to see product data'}</div>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('product_name')} style={{ cursor: 'pointer' }}>
                                        Product Name{sortIndicator('product_name')}
                                    </th>
                                    <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                                        Quantity{sortIndicator('quantity')}
                                    </th>
                                    <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                                        Price{sortIndicator('price')}
                                    </th>
                                    <th>Revenue</th>
                                    <th onClick={() => handleSort('supplier')} style={{ cursor: 'pointer' }}>
                                        Supplier{sortIndicator('supplier')}
                                    </th>
                                    <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                                        Category{sortIndicator('category')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, idx) => (
                                    <tr key={p.id || idx}>
                                        <td style={{ color: 'var(--text)', fontWeight: 500 }}>{p.product_name}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>{p.quantity}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>₹{parseFloat(p.price).toLocaleString()}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                                            ₹{(parseFloat(p.price) * parseInt(p.quantity)).toLocaleString()}
                                        </td>
                                        <td>{p.supplier || '—'}</td>
                                        <td>
                                            <span className={getCategoryClass(p.category)}>
                                                {p.category || 'General'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
