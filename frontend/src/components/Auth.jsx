import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
                // Auto login or show success depending on email confirm settings
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
            display: 'flex', minHeight: '100vh', alignItems: 'center',
            justifyContent: 'center', background: 'linear-gradient(135deg, #3A3A3A 0%, #4A4A4A 50%, #5C5C5C 100%)'
        }}>
            <div
                className="glass-card"
                style={{
                    width: '100%', maxWidth: '420px', padding: '2.5rem',
                    background: 'rgba(255, 255, 227, 0.95)',
                    border: '1px solid rgba(109, 129, 150, 0.2)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25), 0 0 40px rgba(109,129,150,0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '52px', height: '52px',
                        background: 'linear-gradient(135deg, #6D8196, #8A9BAC)',
                        borderRadius: '14px', margin: '0 auto 1rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(109,129,150,0.35)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#4A4A4A', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p style={{ color: '#6B6B6B', fontSize: '0.95rem' }}>
                        {isLogin ? 'Enter your details to access FinSight-OCR' : 'Sign up to start analyzing your shop data'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(180, 60, 60, 0.08)', border: '1px solid rgba(180, 60, 60, 0.2)',
                        color: '#8B3A3A', padding: '0.75rem 1rem', borderRadius: '10px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#6B6B6B', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                                border: '1px solid rgba(74, 74, 74, 0.15)', borderRadius: '10px',
                                color: '#4A4A4A', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#6D8196'; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.12)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(74,74,74,0.15)'; e.target.style.boxShadow = 'none'; }}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#6B6B6B', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                                border: '1px solid rgba(74, 74, 74, 0.15)', borderRadius: '10px',
                                color: '#4A4A4A', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#6D8196'; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.12)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(74,74,74,0.15)'; e.target.style.boxShadow = 'none'; }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.875rem', marginTop: '0.5rem',
                            background: 'linear-gradient(135deg, #6D8196, #8A9BAC)',
                            border: 'none', borderRadius: '10px', color: '#FFFFE3',
                            fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
                            boxShadow: '0 4px 16px rgba(109,129,150,0.3)',
                            letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 24px rgba(109,129,150,0.4)'; } }}
                        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(109,129,150,0.3)'; }}
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none', border: 'none', color: '#6D8196',
                            fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#4A5E6E'}
                        onMouseLeave={(e) => e.target.style.color = '#6D8196'}
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div >
    );
}
