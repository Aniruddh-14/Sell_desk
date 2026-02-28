import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sparkles } from 'lucide-react';
import ScrollReveal from './effects/ScrollReveal';

/* ── Calendar constants ── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PEAK_CATEGORIES = {
    weekend: ['Snacks', 'Beverages', 'Confectionery'],
    monthStart: ['Grocery', 'Dairy', 'Household'],
    midMonth: ['Personal Care', 'Health'],
    monthEnd: ['Grocery', 'Snacks', 'Beverages'],
};

function getPeakInfo(day, dow) {
    const isWeekend = dow === 0 || dow === 6;
    const isMonthStart = day <= 5;
    const isMidMonth = day >= 13 && day <= 17;
    const isMonthEnd = day >= 26;

    if (isMonthStart) return { level: 'high', cats: PEAK_CATEGORIES.monthStart, reason: 'Salary week — staple restocking surge' };
    if (isMonthEnd) return { level: 'high', cats: PEAK_CATEGORIES.monthEnd, reason: 'Month-end rush & bulk buying patterns' };
    if (isMidMonth) return { level: 'moderate', cats: PEAK_CATEGORIES.midMonth, reason: 'Mid-month personal care demand' };
    if (isWeekend) return { level: 'moderate', cats: PEAK_CATEGORIES.weekend, reason: 'Weekend leisure shopping spike' };
    return null;
}

export default function CalendarPage() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();
    const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
        setSelectedDate(null);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
        setSelectedDate(null);
    };

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const selectedPeak = selectedDate ? getPeakInfo(selectedDate, new Date(year, month, selectedDate).getDay()) : null;

    /* ── Count peak days this month ── */
    let peakCount = 0, moderateCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
        const p = getPeakInfo(d, new Date(year, month, d).getDay());
        if (p?.level === 'high') peakCount++;
        else if (p?.level === 'moderate') moderateCount++;
    }

    return (
        <div>
            <div className="page-header">
                <h2>Sales Calendar</h2>
                <p>Predict high-sale dates and plan your inventory accordingly</p>
            </div>

            {/* ── Month Summary Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Peak Sale Days', value: peakCount, color: '#6D8196' },
                    { label: 'Moderate Days', value: moderateCount, color: '#8A9BAC' },
                    { label: 'Regular Days', value: daysInMonth - peakCount - moderateCount, color: '#CBCBCB' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        style={{ padding: '1.25rem', textAlign: 'center' }}
                    >
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.82rem', color: '#9A9A9A', marginTop: 4 }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* ── Calendar + Detail Panel ── */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedPeak ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
                <ScrollReveal direction="up" delay={0.05}>
                    <motion.div
                        className="glass-card"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ padding: '1.75rem' }}
                    >
                        {/* Header with nav */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(109,129,150,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CalendarDays size={20} color="#6D8196" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Sales Forecast</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#9A9A9A' }}>Click a date to see predictions</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={prevMonth} style={{ background: 'rgba(74,74,74,0.06)', border: '1px solid rgba(74,74,74,0.1)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', color: '#4A4A4A', fontWeight: 600, fontSize: '1rem' }}>‹</button>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#4A4A4A', minWidth: 150, textAlign: 'center' }}>{MONTH_NAMES[month]} {year}</span>
                                <button onClick={nextMonth} style={{ background: 'rgba(74,74,74,0.06)', border: '1px solid rgba(74,74,74,0.1)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', color: '#4A4A4A', fontWeight: 600, fontSize: '1rem' }}>›</button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                            {DAYS.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.76rem', fontWeight: 600, color: '#9A9A9A', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d}</div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
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
                                            position: 'relative', padding: '12px 4px', border: 'none', borderRadius: 12,
                                            background: isSelected ? '#6D8196' : isToday ? 'rgba(109,129,150,0.12)' : 'transparent',
                                            color: isSelected ? '#FFFFE3' : isToday ? '#4A4A4A' : '#5C5C5C',
                                            cursor: 'pointer', fontSize: '0.92rem', fontWeight: isToday ? 700 : 500,
                                            fontFamily: 'inherit', transition: 'background 0.15s',
                                        }}
                                    >
                                        {day}
                                        {peak && (
                                            <div style={{
                                                position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                                                width: peak.level === 'high' ? 7 : 5, height: peak.level === 'high' ? 7 : 5,
                                                borderRadius: '50%',
                                                background: isSelected ? '#FFFFE3' : peak.level === 'high' ? '#6D8196' : '#CBCBCB',
                                            }} />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(74,74,74,0.06)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#9A9A9A' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6D8196' }} /> Peak Sales Day
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#9A9A9A' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBCBCB' }} /> Moderate
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#9A9A9A' }}>
                                <span style={{ width: 10, height: 10, borderRadius: 4, background: 'rgba(109,129,150,0.12)' }} /> Today
                            </span>
                        </div>
                    </motion.div>
                </ScrollReveal>

                {/* ── Date Detail Panel ── */}
                {selectedPeak && (
                    <motion.div
                        className="glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'fit-content' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={18} color="#6D8196" />
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#4A4A4A' }}>
                                {MONTH_NAMES[month]} {selectedDate}
                            </h4>
                        </div>

                        <div style={{
                            display: 'inline-flex', alignSelf: 'flex-start',
                            padding: '4px 12px', borderRadius: 16,
                            background: selectedPeak.level === 'high' ? 'rgba(109,129,150,0.12)' : 'rgba(203,203,203,0.2)',
                            fontSize: '0.78rem', fontWeight: 600,
                            color: selectedPeak.level === 'high' ? '#6D8196' : '#8A9BAC',
                        }}>
                            {selectedPeak.level === 'high' ? 'Peak Day' : 'Moderate Day'}
                        </div>

                        <p style={{ fontSize: '0.88rem', color: '#6B6B6B', margin: 0, lineHeight: 1.6 }}>
                            {selectedPeak.reason}
                        </p>

                        <div>
                            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9A9A9A', margin: '0 0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                High-demand categories
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {selectedPeak.cats.map(c => (
                                    <span key={c} style={{
                                        padding: '5px 12px', borderRadius: 16,
                                        background: 'rgba(109,129,150,0.1)',
                                        border: '1px solid rgba(109,129,150,0.18)',
                                        fontSize: '0.8rem', color: '#566A7A', fontWeight: 500,
                                    }}>{c}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            fontSize: '0.84rem', color: '#6B6B6B', padding: '1rem',
                            background: 'rgba(109,129,150,0.05)', borderRadius: 12, lineHeight: 1.6,
                        }}>
                            <strong style={{ color: '#4A4A4A' }}>Tip:</strong> Pre-stock {selectedPeak.cats.slice(0, 2).join(' & ')} items a day before to maximize sales.
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
