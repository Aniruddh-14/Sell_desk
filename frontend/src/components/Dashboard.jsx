import React, { useState, useEffect } from 'react';
import {
    Package,
    DollarSign,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getDashboard } from '../api/client';

const COLORS = ['#6366f1', '#14b8a6', '#f97316', '#f43f5e', '#8b5cf6', '#10b981', '#0ea5e9', '#f59e0b'];

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const result = await getDashboard();
            setData(result);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h2>📊 Dashboard</h2>
                    <p>Loading analytics...</p>
                </div>
                <div className="loading-spinner" />
                <p className="loading-text">Crunching your numbers...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="empty-state">
                <h3>No data available</h3>
                <p>Upload some invoices to see your analytics</p>
            </div>
        );
    }

    const chartTooltipStyle = {
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#f1f5f9',
        fontSize: '0.85rem',
    };

    return (
        <div>
            <div className="page-header">
                <h2>📊 Dashboard</h2>
                <p>Real-time analytics from your invoice data</p>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="glass-card stat-card animate-in">
                    <div className="stat-icon"><Package size={22} /></div>
                    <div className="stat-label">Total Products</div>
                    <div className="stat-value">{data.total_products}</div>
                </div>
                <div className="glass-card stat-card animate-in">
                    <div className="stat-icon"><DollarSign size={22} /></div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">₹{data.total_revenue?.toLocaleString()}</div>
                </div>
                <div className="glass-card stat-card animate-in">
                    <div className="stat-icon"><TrendingUp size={22} /></div>
                    <div className="stat-label">Avg. Price</div>
                    <div className="stat-value">₹{data.avg_price?.toLocaleString()}</div>
                </div>
                <div className="glass-card stat-card animate-in">
                    <div className="stat-icon"><Users size={22} /></div>
                    <div className="stat-label">Suppliers</div>
                    <div className="stat-value">{data.supplier_count}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Top Selling Products */}
                <div className="glass-card chart-card animate-in">
                    <h3>
                        <span className="chart-dot" style={{ background: '#10b981' }} />
                        Top Selling Products
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.top_selling?.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Bar dataKey="quantity" fill="#10b981" radius={[0, 6, 6, 0]} barSize={18} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Slow Moving Products */}
                <div className="glass-card chart-card animate-in">
                    <h3>
                        <span className="chart-dot" style={{ background: '#f43f5e' }} />
                        Slow Moving Products
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.slow_moving?.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Bar dataKey="quantity" fill="#f43f5e" radius={[0, 6, 6, 0]} barSize={18} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Supplier */}
                <div className="glass-card chart-card animate-in">
                    <h3>
                        <span className="chart-dot" style={{ background: '#6366f1' }} />
                        Revenue by Supplier
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data.profit_analysis} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="supplier" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={chartTooltipStyle} formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']} />
                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={30}>
                                {data.profit_analysis?.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="glass-card chart-card animate-in">
                    <h3>
                        <span className="chart-dot" style={{ background: '#8b5cf6' }} />
                        Category Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={data.category_distribution}
                                dataKey="count"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={50}
                                paddingAngle={3}
                                label={({ category, count }) => `${category} (${count})`}
                                labelLine={{ stroke: '#64748b' }}
                            >
                                {data.category_distribution?.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={chartTooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
