import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

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

export default function Auth() {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                const sign = await signIn({ email, password });
                if (sign.error) throw sign.error;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', minHeight: '100vh',
            background: 'linear-gradient(135deg, #3A3A3A 0%, #4A4A4A 50%, #5C5C5C 100%)',
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
                        background: 'radial-gradient(circle, rgba(109,129,150,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <motion.div
                    animate={{ ...floatAnim, transition: { ...floatAnim.transition, delay: 1.5 } }}
                    style={{
                        position: 'absolute', bottom: '15%', right: '12%',
                        width: 180, height: 180, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(203,203,203,0.08) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <motion.div
                    animate={{ ...floatAnim, transition: { ...floatAnim.transition, delay: 0.8 } }}
                    style={{
                        position: 'absolute', top: '55%', left: '60%',
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(109,129,150,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logo */}
                <motion.div variants={fadeUp} custom={0} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56,
                        background: 'linear-gradient(135deg, #6D8196, #8A9BAC)',
                        borderRadius: 16, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 32px rgba(109,129,150,0.3)',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </motion.div>

                {/* Tagline — word-by-word entrance */}
                <div style={{
                    fontSize: '3.2rem', fontWeight: 800,
                    lineHeight: 1.15, letterSpacing: '-2px',
                    color: '#FFFFE3', marginBottom: '1.25rem',
                    maxWidth: 480, position: 'relative',
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
                        Invoice
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
                                background: 'linear-gradient(90deg, #8A9BAC, #CBCBCB, #FFFFE3, #8A9BAC, #CBCBCB)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Analytics.
                        </motion.span>
                        {/* Glowing underline */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                position: 'absolute', bottom: -4, left: 0, right: 0,
                                height: 3, borderRadius: 2, transformOrigin: 'left',
                                background: 'linear-gradient(90deg, #6D8196, #8A9BAC, transparent)',
                                boxShadow: '0 0 12px rgba(109,129,150,0.4)',
                            }}
                        />
                    </motion.span>
                </div>

                <motion.p
                    variants={fadeUp}
                    custom={2}
                    style={{
                        fontSize: '1.15rem', color: 'rgba(203,203,203,0.75)',
                        lineHeight: 1.7, maxWidth: 420, marginBottom: '2.5rem',
                    }}
                >
                    Extract, analyze, and reconcile invoices with AI-powered OCR.
                    Built for modern retail businesses.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                    variants={fadeUp}
                    custom={3}
                    style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
                >
                    {['Gemini AI OCR', 'Auto Reconciliation', 'Smart Insights', 'ITR Reports'].map((tag) => (
                        <span key={tag} style={{
                            padding: '0.4rem 1rem', borderRadius: 24,
                            background: 'rgba(109,129,150,0.15)',
                            border: '1px solid rgba(109,129,150,0.25)',
                            color: 'rgba(255,255,227,0.8)', fontSize: '0.82rem',
                            fontWeight: 500, letterSpacing: '0.3px',
                        }}>
                            {tag}
                        </span>
                    ))}
                </motion.div>

                {/* Bottom credit */}
                <motion.p
                    variants={fadeUp}
                    custom={4}
                    style={{
                        marginTop: 'auto', paddingTop: '3rem',
                        fontSize: '0.78rem', color: 'rgba(203,203,203,0.35)',
                        letterSpacing: '0.5px',
                    }}
                >
                    Powered by Gemini AI + vLLM OCR
                </motion.p>
            </motion.div>

            {/* ═══════════════════════════════════
                RIGHT — Sign In / Sign Up Form
            ═══════════════════════════════════ */}
            <div style={{
                width: '480px', minWidth: '380px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2rem',
                background: 'rgba(255, 255, 227, 0.97)',
                borderLeft: '1px solid rgba(109,129,150,0.15)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.1)',
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ width: '100%', maxWidth: '380px' }}
                >
                    {/* Header */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            style={{ marginBottom: '2rem' }}
                        >
                            <h2 style={{
                                fontSize: '1.75rem', fontWeight: 700,
                                color: '#4A4A4A', marginBottom: '0.5rem',
                            }}>
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p style={{ color: '#6B6B6B', fontSize: '0.95rem' }}>
                                {isLogin
                                    ? 'Enter your credentials to access FinSight-OCR'
                                    : 'Sign up to start analyzing your invoices'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(180, 60, 60, 0.06)',
                                    border: '1px solid rgba(180, 60, 60, 0.15)',
                                    color: '#8B3A3A', padding: '0.75rem 1rem',
                                    borderRadius: 10, marginBottom: '1.5rem',
                                    fontSize: '0.9rem', textAlign: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{
                                display: 'block', color: '#6B6B6B',
                                fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600,
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.875rem 1rem',
                                    background: 'rgba(74, 74, 74, 0.04)',
                                    border: '1px solid rgba(74, 74, 74, 0.15)',
                                    borderRadius: 10, color: '#4A4A4A',
                                    fontSize: '0.95rem', outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#6D8196'; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(74,74,74,0.15)'; e.target.style.boxShadow = 'none'; }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block', color: '#6B6B6B',
                                fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600,
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.875rem 1rem',
                                    background: 'rgba(74, 74, 74, 0.04)',
                                    border: '1px solid rgba(74, 74, 74, 0.15)',
                                    borderRadius: 10, color: '#4A4A4A',
                                    fontSize: '0.95rem', outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#6D8196'; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(74,74,74,0.15)'; e.target.style.boxShadow = 'none'; }}
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                            whileTap={!loading ? { scale: 0.985 } : {}}
                            style={{
                                width: '100%', padding: '0.875rem', marginTop: '0.5rem',
                                background: 'linear-gradient(135deg, #6D8196, #8A9BAC)',
                                border: 'none', borderRadius: 10, color: '#FFFFE3',
                                fontSize: '1rem', fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'opacity 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 16px rgba(109,129,150,0.3)',
                                letterSpacing: '0.3px',
                            }}
                        >
                            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                        </motion.button>
                    </form>

                    {/* Toggle */}
                    <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{
                                background: 'none', border: 'none', color: '#6D8196',
                                fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500,
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#4A5E6E'}
                            onMouseLeave={(e) => e.target.style.color = '#6D8196'}
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
