import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
                <div>
                     <div className="page-eyebrow">Demand Forecasting</div>
                     <div className="page-title">Sales Calendar</div>
                </div>
            </div>

            {/* ── Month Summary Stats ── */}
            <div className="grid3" style={{ marginBottom: '24px' }}>
                {[
                    { label: 'Peak Sale Days', value: peakCount, color: 'var(--gold)' },
                    { label: 'Moderate Days', value: moderateCount, color: 'var(--text)' },
                    { label: 'Regular Days', value: daysInMonth - peakCount - moderateCount, color: 'var(--text3)' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="metric-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                        <div className="metric-label">{s.label}</div>
                        <div className="metric-val" style={{ color: s.color }}>{s.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* ── Calendar + Detail Panel ── */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedPeak ? '1fr 340px' : '1fr', gap: '24px' }}>
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header with nav */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <div className="card-title" style={{ margin: 0 }}>Sales Forecast</div>
                            <div className="card-heading" style={{ fontSize: '13px', marginTop: '4px' }}>Click a date to see predictions</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: '6px 12px' }}>‹</button>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', minWidth: '130px', textAlign: 'center' }}>{MONTH_NAMES[month]} {year}</span>
                            <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: '6px 12px' }}>›</button>
                        </div>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d}</div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {cells.map((day, i) => {
                            if (!day) return <div key={`e${i}`} />;
                            const dow = new Date(year, month, day).getDay();
                            const peak = getPeakInfo(day, dow);
                            const isToday = isCurrentMonth && day === today;
                            const isSelected = selectedDate === day;

                            return (
                                <motion.button
                                    key={day}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDate(isSelected ? null : day)}
                                    style={{
                                        position: 'relative', padding: '16px 4px', borderRadius: '8px',
                                        background: isSelected ? 'var(--gold)' : isToday ? 'var(--navy4)' : 'var(--card)',
                                        color: isSelected ? 'var(--navy)' : isToday ? 'var(--gold)' : 'var(--text2)',
                                        cursor: 'pointer', fontSize: '14px', fontWeight: isToday ? 700 : 500,
                                        fontFamily: 'var(--font-heading)', transition: 'background 0.15s',
                                        border: isSelected ? '1px solid var(--gold)' : isToday ? '1px solid var(--gold-border)' : '1px solid var(--border)'
                                    }}
                                >
                                    {day}
                                    {peak && (
                                        <div style={{
                                            position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)',
                                            width: peak.level === 'high' ? '6px' : '4px', height: peak.level === 'high' ? '6px' : '4px',
                                            borderRadius: '50%',
                                            background: isSelected ? 'var(--navy)' : peak.level === 'high' ? 'var(--green)' : 'var(--text3)',
                                        }} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border2)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} /> Peak Sales Day
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text3)' }} /> Moderate
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--navy4)' }} /> Today
                        </span>
                    </div>
                </motion.div>

                {/* ── Date Detail Panel ── */}
                {selectedPeak && (
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="card-title" style={{ margin: 0, fontSize: '18px' }}>
                                {MONTH_NAMES[month]} {selectedDate}
                            </div>
                        </div>

                        <div className={selectedPeak.level === 'high' ? 'tag tag-green' : 'tag'} style={{ alignSelf: 'flex-start' }}>
                            {selectedPeak.level === 'high' ? 'Peak Demand Day' : 'Moderate Demand Day'}
                        </div>

                        <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                            {selectedPeak.reason}
                        </p>

                        <div>
                            <div className="card-heading" style={{ marginBottom: '12px' }}>High-demand categories</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedPeak.cats.map(c => (
                                    <span key={c} className="tag tag-gold">{c}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            fontSize: '13px', color: 'var(--text)', padding: '16px',
                            background: 'var(--navy3)', borderRadius: '8px', lineHeight: 1.5,
                            border: '1px solid var(--border)'
                        }}>
                            <span style={{ color: 'var(--gold)', fontWeight: 600, marginRight: '4px' }}>Tip:</span> 
                            Pre-stock {selectedPeak.cats.slice(0, 2).join(' & ')} items a day before to maximize sales.
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
