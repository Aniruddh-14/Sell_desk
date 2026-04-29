import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/* ── Animation variants ── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const floatAnim = {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const userRoles = [
    { id: 'cafe', label: 'Cafe', icon: '☕', desc: 'Manage your daily cafe inventory and track ingredients.' },
    { id: 'stationary', label: 'Stationary', icon: '📓', desc: 'Keep track of notebooks, pens, and office supplies.' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊', desc: 'Track medicines, expiry dates, and prescriptions.' }
];

export default function Auth() {
    const { loginAs } = useContext(AuthContext);
    const [selectedRole, setSelectedRole] = useState(userRoles[0].label);

    const handleEnter = () => {
        loginAs(selectedRole);
    };

    return (
        <div style={{
            display: 'flex', minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--blue-vivid) 0%, var(--blue-bright) 50%, var(--blue-sky) 100%)',
        }}>
            {/* ═══════════════════════════════════
                LEFT — Tagline & Branding
            ═══════════════════════════════════ */}
            <motion.div
                style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '4rem 3.5rem',
                    position: 'relative', overflow: 'hidden',
                }}
                variants={stagger}
                initial="hidden"
                animate="visible"
            >
                {/* Decorative floating orbs */}
                <motion.div
                    animate={floatAnim}
                    style={{
                        position: 'absolute', top: '12%', left: '8%',
                        width: 120, height: 120, borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--blue-dim) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <motion.div
                    animate={{ ...floatAnim, transition: { ...floatAnim.transition, delay: 1.5 } }}
                    style={{
                        position: 'absolute', bottom: '15%', right: '12%',
                        width: 180, height: 180, borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--navy4) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logo */}
                <motion.div variants={fadeUp} custom={0} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56,
                        background: 'var(--navy4)',
                        border: '1px solid var(--gold-border)',
                        borderRadius: 16, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue-sky)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </motion.div>

                {/* Tagline — word-by-word entrance */}
                <div style={{
                    fontSize: '3.2rem', fontWeight: 800,
                    lineHeight: 1.15, letterSpacing: '-2px',
                    color: 'var(--text)', marginBottom: '1.25rem',
                    maxWidth: 480, position: 'relative',
                    fontFamily: 'var(--font-heading)'
                }}>
                    {/* "Smart" */}
                    <motion.span
                        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ display: 'inline-block', marginRight: '0.3em' }}
                    >
                        Smart
                    </motion.span>
                    {/* "Invoice" */}
                    <motion.span
                        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ display: 'inline-block' }}
                    >
                        Retail
                    </motion.span>
                    <br />
                    {/* "Analytics." — shimmer gradient sweep */}
                    <motion.span
                        initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ display: 'inline-block', position: 'relative' }}
                    >
                        <motion.span
                            animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            style={{
                                color: 'var(--blue-sky)',
                                textShadow: '0 0 16px rgba(77, 163, 255, 0.4)'
                            }}
                        >
                            Intelligence.
                        </motion.span>
                    </motion.span>
                </div>

                <motion.p
                    variants={fadeUp}
                    custom={2}
                    style={{
                        fontSize: '1.15rem', color: 'var(--blue-deep)',
                        lineHeight: 1.7, maxWidth: 420, marginBottom: '2.5rem',
                        fontWeight: 500,
                    }}
                >
                    Extract, analyze, and reconcile data seamlessly.
                    Built for modern retail businesses.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                    variants={fadeUp}
                    custom={3}
                    style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
                >
                    {['AI Extraction', 'Auto Reconciliation', 'Smart Insights', 'ITR Reports'].map((tag) => (
                        <span key={tag} style={{
                            padding: '0.4rem 1rem', borderRadius: 24,
                            background: 'var(--blue-deep)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--white)', fontSize: '0.82rem',
                            fontWeight: 600, letterSpacing: '0.3px',
                        }}>
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════
                RIGHT — Role Selection
            ═══════════════════════════════════ */}
            <div style={{
                width: '480px', minWidth: '420px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2rem',
                background: 'var(--navy)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ width: '100%', maxWidth: '380px' }}
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h2 style={{
                            fontSize: '1.75rem', fontWeight: 700,
                            color: 'var(--text)', marginBottom: '0.5rem',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            Welcome to SellDesk
                        </h2>
                        <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>
                            Choose your workspace to enter
                        </p>
                    </motion.div>

                    {/* Role Selection Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {userRoles.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRole(role.label)}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    background: selectedRole === role.label ? 'rgba(77, 163, 255, 0.1)' : 'var(--navy3)',
                                    border: `1px solid ${selectedRole === role.label ? 'var(--blue-sky)' : 'var(--border)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{
                                    fontSize: '1.8rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '48px', height: '48px',
                                    background: 'var(--navy)',
                                    borderRadius: '50%',
                                    border: '1px solid var(--border)',
                                }}>
                                    {role.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        color: selectedRole === role.label ? 'var(--blue-sky)' : 'var(--text)',
                                        fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem'
                                    }}>
                                        {role.label}
                                    </div>
                                    <div style={{ color: 'var(--text3)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                        {role.desc}
                                    </div>
                                </div>
                                {/* Radio/Check indicator */}
                                <div style={{
                                    width: '20px', height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${selectedRole === role.label ? 'var(--blue-sky)' : 'var(--border)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: selectedRole === role.label ? 'var(--blue-sky)' : 'transparent',
                                }}>
                                    {selectedRole === role.label && (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleEnter}
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '1rem',
                            fontSize: '1.05rem', fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        Enter Workspace
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
