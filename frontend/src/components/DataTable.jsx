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
        if (!cat) return '';
        return cat.toLowerCase().replace(/\s+/g, '-');
    };

    const sortIndicator = (field) => {
        if (sortField !== field) return '';
        return sortDir === 'asc' ? ' ↑' : ' ↓';
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h2> Product Data</h2>
                    <p>Loading products...</p>
                </div>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>🗃️ Product Data</h2>
                <p>View and manage all extracted product data • {products.length} products</p>
            </div>

            <div className="glass-card animate-in">
                <div className="table-header">
                    <div className="search-box">
                        <input
                            type="text"
                            id="product-search"
                            placeholder="Search products, suppliers, categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="table-actions">
                        <button className="btn btn-secondary" onClick={loadProducts} id="refresh-data">
                            Refresh
                        </button>
                        <button className="btn btn-success" onClick={handleExport} id="export-csv">
                            Export CSV
                        </button>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <h3>No products found</h3>
                        <p>{search ? 'Try a different search term' : 'Upload some invoices to see product data'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrap">
                        <table className="data-table" id="products-table">
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
                                        <td style={{ fontWeight: 500 }}>{p.product_name}</td>
                                        <td>{p.quantity}</td>
                                        <td>₹{parseFloat(p.price).toLocaleString()}</td>
                                        <td style={{ color: '#6D8196', fontWeight: 600 }}>
                                            ₹{(parseFloat(p.price) * parseInt(p.quantity)).toLocaleString()}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{p.supplier || '—'}</td>
                                        <td>
                                            <span className={`category-badge ${getCategoryClass(p.category)}`}>
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
