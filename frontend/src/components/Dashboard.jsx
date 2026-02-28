import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Package, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { getDashboard } from '../api/client';
import ScrollReveal from './effects/ScrollReveal';

const COLORS = [
    '#6D8196', '#4A4A4A', '#8A9BAC', '#566A7A',
    '#A3B1BF', '#5C6E7E', '#7B8D9D', '#3A3A3A',
];

const chartTooltipStyle = {
    backgroundColor: '#FFFFE3',
    border: '1px solid rgba(74,74,74,0.12)',
    borderRadius: '10px',
    color: '#4A4A4A',
    fontSize: '0.84rem',
    boxShadow: '0 20px 40px rgba(74,74,74,0.15)',
};

/* ── Stat card configs ── */
const STAT_CONFIG = [
    {
        key: 'total_products',
        label: 'Total Products',
        Icon: Package,
        iconColor: '#6D8196',
        iconBg: 'rgba(109,129,150,0.12)',
        formatter: (v) => Math.round(v).toLocaleString('en-IN'),
    },
    {
        key: 'total_revenue',
        label: 'Total Revenue',
        Icon: IndianRupee,
        iconColor: '#566A7A',
        iconBg: 'rgba(86,106,122,0.12)',
        formatter: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    },
    {
        key: 'avg_price',
        label: 'Avg. Price',
        Icon: TrendingUp,
        iconColor: '#8A9BAC',
        iconBg: 'rgba(138,155,172,0.12)',
        formatter: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    },
    {
        key: 'supplier_count',
        label: 'Suppliers',
        Icon: Users,
        iconColor: '#4A5E6E',
        iconBg: 'rgba(74,94,110,0.12)',
        formatter: (v) => Math.round(v).toLocaleString('en-IN'),
    },
];

/* ── Live clock ── */
function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
    );
}

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

/* ── Stagger container variants ── */
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
                <div className="page-header"><h2>Dashboard</h2><p>Loading analytics...</p></div>
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

    return (
        <div>
            {/* ════════════════════════════════
                Cinematic Hero
            ════════════════════════════════ */}
            <motion.div
                className="dashboard-hero"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, ease: [0.25, 0.4, 0.25, 1] }}
            >
                <div className="hero-eyebrow">
                    <span className="live-dot" />
                    <span>Live Analytics</span>
                    <span className="hero-time"><LiveClock /></span>
                </div>

                <h1 className="hero-headline">
                    Your Business,<br />
                    <span className="gradient-text">Amplified.</span>
                </h1>

                <p className="hero-sub">
                    Tracking{' '}
                    <strong>{data.total_products?.toLocaleString('en-IN')}</strong>{' '}
                    products across{' '}
                    <strong>{data.supplier_count}</strong>{' '}
                    suppliers — powered by Gemini&nbsp;AI.
                </p>
            </motion.div>

            {/* ════════════════════════════════
                Stat Cards — staggered entrance
            ════════════════════════════════ */}
            <motion.div
                className="stats-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {STAT_CONFIG.map(({ key, label, Icon, iconColor, iconBg, formatter }) => (
                    <motion.div
                        key={key}
                        className="glass-card stat-card"
                        variants={cardVariants}
                        whileHover={{ y: -5, transition: { duration: 0.22 } }}
                    >
                        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
                            <Icon size={20} />
                        </div>
                        <div className="stat-label">{label}</div>
                        <div className="stat-value">
                            <CountUp value={data[key] ?? 0} formatter={formatter} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ════════════════════════════════
                Charts — scroll-reveal
            ════════════════════════════════ */}
            <div className="charts-grid">
                <ScrollReveal direction="up" delay={0}>
                    <div className="glass-card chart-card" style={{ gridColumn: '1 / -1' }}>
                        <h3>
                            <span className="chart-dot" style={{ background: '#6D8196' }} />
                            Sales & Products Timeline
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.monthly_sales} margin={{ left: 20, right: 20, top: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,74,74,0.08)" />
                                <XAxis dataKey="month" tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(109,129,150,0.06)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#6D8196" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="products" name="Products Sold" stroke="#4A4A4A" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                    <div className="glass-card chart-card">
                        <h3>
                            <span className="chart-dot" style={{ background: '#566A7A' }} />
                            Top Selling Products
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.top_selling?.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,74,74,0.08)" />
                                <XAxis type="number" tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(109,129,150,0.06)' }} />
                                <Bar dataKey="quantity" fill="#6D8196" radius={[0, 6, 6, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                    <div className="glass-card chart-card">
                        <h3>
                            <span className="chart-dot" style={{ background: '#4A4A4A' }} />
                            Slow Moving Products
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.slow_moving?.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,74,74,0.08)" />
                                <XAxis type="number" tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(109,129,150,0.06)' }} />
                                <Bar dataKey="quantity" fill="#4A4A4A" radius={[0, 6, 6, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.18}>
                    <div className="glass-card chart-card">
                        <h3>
                            <span className="chart-dot" style={{ background: '#8A9BAC' }} />
                            Revenue by Supplier
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.profit_analysis} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,74,74,0.08)" />
                                <XAxis dataKey="supplier" tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={60} />
                                <YAxis tick={{ fill: '#9A9A9A', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={chartTooltipStyle} formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']} cursor={{ fill: 'rgba(109,129,150,0.06)' }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={28}>
                                    {data.profit_analysis?.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.26}>
                    <div className="glass-card chart-card">
                        <h3>
                            <span className="chart-dot" style={{ background: '#566A7A' }} />
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
                                    innerRadius={52}
                                    paddingAngle={3}
                                    label={({ category, count }) => `${category} (${count})`}
                                    labelLine={{ stroke: '#9A9A9A' }}
                                >
                                    {data.category_distribution?.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={chartTooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}