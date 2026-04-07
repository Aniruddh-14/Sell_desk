import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { getDashboard } from '../api/client';

const COLORS = [
    '#c9a84c', '#e4c26a', '#f5d98a', '#2ec4a0',
    '#4a9eff', '#e0a43a', '#e05c5c', '#5a7896',
];

const chartTooltipStyle = {
    backgroundColor: 'var(--navy2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)',
    fontSize: '0.84rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
};

/* ── Stat card configs ── */
const STAT_CONFIG = [
    {
        key: 'total_products',
        label: 'Total Products',
        accentBg: 'var(--card)',
        color: 'var(--text)',
        formatter: (v) => Math.round(v).toLocaleString('en-IN'),
    },
    {
        key: 'total_revenue',
        label: 'Total Revenue',
        accentBg: 'var(--gold-dim)',
        color: 'var(--gold)',
        border: '1px solid var(--gold-border)',
        formatter: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    },
    {
        key: 'avg_price',
        label: 'Avg. Price',
        accentBg: 'var(--card)',
        color: 'var(--text)',
        formatter: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    },
    {
        key: 'supplier_count',
        label: 'Suppliers',
        accentBg: 'var(--card)',
        color: 'var(--text)',
        formatter: (v) => Math.round(v).toLocaleString('en-IN'),
    },
];

/* ── Count-up number ── */
function CountUp({ value, formatter = String, duration = 1.7 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const started = useRef(false);

    useEffect(() => {
        if (!isInView || started.current || !ref.current) return;
        started.current = true;
        const controls = animate(0, value, {
            duration,
            ease: 'easeOut',
            onUpdate: (v) => {
                if (ref.current) ref.current.textContent = formatter(v);
            },
        });
        return () => controls.stop();
    }, [isInView, value, duration, formatter]);

    return <span ref={ref}>{formatter(0)}</span>;
}

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.96 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            setData(await getDashboard());
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div><div className="page-title">Loading Analytics...</div></div></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="card">
                <div className="card-title">No data available</div>
                <p>Upload some invoices to see your analytics</p>
            </div>
        );
    }

    const gridLayout = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-eyebrow">Daily Command Center</div>
                    <div className="page-title">Overview</div>
                </div>
            </div>

            <motion.div
                className="metrics-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {STAT_CONFIG.map(({ key, label, accentBg, color, border }) => (
                    <motion.div
                        key={key}
                        className="metric-card"
                        style={{ background: accentBg, border: border }}
                        variants={cardVariants}
                    >
                        <div className="metric-label">{label}</div>
                        <div className="metric-value" style={{ color: color }}>
                            <CountUp value={data[key] ?? 0} formatter={STAT_CONFIG.find(s=>s.key===key).formatter} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div style={gridLayout}>
                <div className="card" style={{ gridColumn: '1 / 3' }}>
                    <div className="card-title">Sales & Products Timeline</div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthly_sales} margin={{ left: 10, right: 10, top: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--card2)' }} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="var(--gold)" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="products" name="Products Sold" stroke="var(--blue)" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">Top Selling Products</div>
                    <div className="chart-container" style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.top_selling?.slice(0, 8)} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--card2)' }} />
                                <Bar dataKey="quantity" fill="var(--green)" radius={[0, 6, 6, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">Revenue by Supplier</div>
                    <div className="chart-container" style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.profit_analysis} margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="supplier" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={60} />
                                <YAxis tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={chartTooltipStyle} formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']} cursor={{ fill: 'var(--card2)' }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={28}>
                                    {data.profit_analysis?.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}