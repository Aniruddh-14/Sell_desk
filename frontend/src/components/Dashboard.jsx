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

    function SalesCalendar({ data }) {
        const now = new Date();
        const [month, setMonth] = useState(now.getMonth());
        const [year, setYear] = useState(now.getFullYear());
        const [selectedDate, setSelectedDate] = useState(null);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = now.getDate();
        const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

        const prevMonth = () => {
            if (month === 0) { setMonth(11); setYear(year - 1); }
            else setMonth(month - 1);
            setSelectedDate(null);
        };
        const nextMonth = () => {
            if (month === 11) { setMonth(0); setYear(year + 1); }
            else setMonth(month + 1);
            setSelectedDate(null);
        };

        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);

        const selectedPeak = selectedDate ? getPeakInfo(selectedDate, new Date(year, month, selectedDate).getDay()) : null;

        return (
            <ScrollReveal direction="up" delay={0.05}>
                <div style={{ display: 'grid', gridTemplateColumns: selectedPeak ? '1fr 320px' : '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <motion.div
                        className="glass-card"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ padding: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(109,129,150,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CalendarDays size={18} color="#6D8196" />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Sales Forecast Calendar</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={prevMonth} style={{ background: 'rgba(74,74,74,0.06)', border: '1px solid rgba(74,74,74,0.1)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', color: '#4A4A4A', fontWeight: 600 }}>‹</button>
                                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4A4A4A', minWidth: 130, textAlign: 'center' }}>{MONTH_NAMES[month]} {year}</span>
                                <button onClick={nextMonth} style={{ background: 'rgba(74,74,74,0.06)', border: '1px solid rgba(74,74,74,0.1)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', color: '#4A4A4A', fontWeight: 600 }}>›</button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                            {DAYS.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: '#9A9A9A', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d}</div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                            {cells.map((day, i) => {
                                if (!day) return <div key={`e${i}`} />;
                                const dow = new Date(year, month, day).getDay();
                                const peak = getPeakInfo(day, dow);
                                const isToday = isCurrentMonth && day === today;
                                const isSelected = selectedDate === day;

                                return (
                                    <motion.button
                                        key={day}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedDate(isSelected ? null : day)}
                                        style={{
                                            position: 'relative', padding: '10px 4px', border: 'none', borderRadius: 10,
                                            background: isSelected ? '#6D8196' : isToday ? 'rgba(109,129,150,0.12)' : 'transparent',
                                            color: isSelected ? '#FFFFE3' : isToday ? '#4A4A4A' : '#5C5C5C',
                                            cursor: 'pointer', fontSize: '0.88rem', fontWeight: isToday ? 700 : 500,
                                            fontFamily: 'inherit', transition: 'background 0.15s',
                                        }}
                                    >
                                        {day}
                                        {peak && (
                                            <div style={{
                                                position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                                                width: peak.level === 'high' ? 6 : 4, height: peak.level === 'high' ? 6 : 4,
                                                borderRadius: '50%',
                                                background: isSelected ? '#FFFFE3' : peak.level === 'high' ? '#6D8196' : '#CBCBCB',
                                            }} />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(74,74,74,0.06)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#9A9A9A' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6D8196' }} /> Peak Sales Day
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#9A9A9A' }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#CBCBCB' }} /> Moderate
                            </span>
                        </div>
                    </motion.div>

                    {/* Date Detail Panel */}
                    {selectedPeak && (
                        <motion.div
                            className="glass-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sparkles size={16} color="#6D8196" />
                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#4A4A4A' }}>
                                    {MONTH_NAMES[month]} {selectedDate} — {selectedPeak.level === 'high' ? 'Peak' : 'Moderate'} Day
                                </h4>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#6B6B6B', margin: 0, lineHeight: 1.6 }}>
                                {selectedPeak.reason}
                            </p>
                            <div>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9A9A9A', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>High-demand categories</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {selectedPeak.cats.map(c => (
                                        <span key={c} style={{
                                            padding: '4px 10px', borderRadius: 16,
                                            background: 'rgba(109,129,150,0.1)',
                                            border: '1px solid rgba(109,129,150,0.18)',
                                            fontSize: '0.78rem', color: '#566A7A', fontWeight: 500,
                                        }}>{c}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#6B6B6B', padding: '0.75rem', background: 'rgba(109,129,150,0.05)', borderRadius: 10, lineHeight: 1.6 }}>
                                <strong style={{ color: '#4A4A4A' }}>Tip:</strong> Pre-stock {selectedPeak.cats.slice(0, 2).join(' & ')} items a day before to maximize sales.
                            </div>
                        </motion.div>
                    )}
                </div>
            </ScrollReveal>
        );
    }

    /* ════════════════════════════════════════
       SMART INVENTORY NOTIFICATIONS
    ════════════════════════════════════════ */
    function generateNotifications(data) {
        if (!data) return [];
        const notes = [];
        const now = new Date();
        const hour = now.getHours();

        // Low-stock alerts (qty < 20)
        const lowStock = data.top_selling?.filter(p => p.quantity < 20) || [];
        if (lowStock.length > 0) {
            notes.push({
                id: 'low-stock',
                icon: <AlertTriangle size={16} />,
                iconBg: 'rgba(139,58,58,0.1)',
                iconColor: '#8B3A3A',
                title: 'Low Stock Alert',
                body: `${lowStock.map(p => p.name).join(', ')} — running below 20 units. Reorder soon.`,
                time: 'Now',
                priority: 'high',
            });
        }

        // Top sellers to restock
        const topSellers = data.top_selling?.slice(0, 3) || [];
        if (topSellers.length > 0) {
            notes.push({
                id: 'restock-top',
                icon: <ShoppingCart size={16} />,
                iconBg: 'rgba(109,129,150,0.12)',
                iconColor: '#6D8196',
                title: 'Restock Best Sellers',
                body: `Keep ${topSellers.map(p => p.name).join(', ')} well-stocked — they drive the most revenue.`,
                time: '1h ago',
                priority: 'medium',
            });
        }

        // Underperformers
        const slowItems = data.slow_moving?.slice(0, 2) || [];
        if (slowItems.length > 0) {
            notes.push({
                id: 'slow-movers',
                icon: <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />,
                iconBg: 'rgba(74,74,74,0.08)',
                iconColor: '#4A4A4A',
                title: 'Slow Movers — Consider Discounts',
                body: `${slowItems.map(p => p.name).join(' and ')} are barely moving. Run a promotion or bundled deal.`,
                time: '2h ago',
                priority: 'low',
            });
        }

        // Time-based tip
        const dow = now.getDay();
        if (dow === 5 || dow === 4) {
            notes.push({
                id: 'weekend-prep',
                icon: <Sparkles size={16} />,
                iconBg: 'rgba(109,129,150,0.1)',
                iconColor: '#8A9BAC',
                title: 'Weekend Prep Reminder',
                body: 'Snacks, beverages & confectionery spike on weekends. Ensure shelves are stocked by Friday evening.',
                time: 'Today',
                priority: 'medium',
            });
        }

        // Category insight
        const topCat = data.category_distribution?.sort((a, b) => b.count - a.count)[0];
        if (topCat) {
            notes.push({
                id: 'top-category',
                icon: <ArrowUpRight size={16} />,
                iconBg: 'rgba(86,106,122,0.1)',
                iconColor: '#566A7A',
                title: `${topCat.category} is Your #1 Category`,
                body: `${topCat.count} products belong to ${topCat.category}. Prioritize supplier orders for this segment.`,
                time: '3h ago',
                priority: 'low',
            });
        }

        return notes;
    }

    function InventoryNotifications({ data }) {
        const notifications = generateNotifications(data);
        const [expanded, setExpanded] = useState(true);

        return (
            <ScrollReveal direction="up" delay={0.1}>
                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded ? '1.25rem' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'rgba(109,129,150,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={18} color="#6D8196" />
                                {notifications.length > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4,
                                        width: 18, height: 18, borderRadius: '50%',
                                        background: '#6D8196', color: '#FFFFE3',
                                        fontSize: '0.65rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Smart Inventory Alerts</h3>
                        </div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            style={{
                                background: 'rgba(74,74,74,0.06)', border: '1px solid rgba(74,74,74,0.1)',
                                borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
                                fontFamily: 'inherit', color: '#6B6B6B', fontSize: '0.82rem', fontWeight: 500,
                            }}
                        >
                            {expanded ? 'Collapse' : 'Expand'}
                        </button>
                    </div>

                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                        >
                            {notifications.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0' }}>No alerts right now — all good!</p>
                            ) : notifications.map((n) => (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                                        padding: '0.9rem 1rem', borderRadius: 12,
                                        background: n.priority === 'high' ? 'rgba(139,58,58,0.04)' : 'rgba(74,74,74,0.025)',
                                        border: `1px solid ${n.priority === 'high' ? 'rgba(139,58,58,0.1)' : 'rgba(74,74,74,0.06)'}`,
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: n.iconBg, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', color: n.iconColor,
                                    }}>
                                        {n.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#4A4A4A' }}>{n.title}</span>
                                            <span style={{ fontSize: '0.72rem', color: '#9A9A9A', flexShrink: 0, marginLeft: 8 }}>{n.time}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B6B6B', lineHeight: 1.5 }}>{n.body}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </ScrollReveal>
        );
    }

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