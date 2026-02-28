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
            justifyContent: 'center', background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)'
        }}>
            <div
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '48px', height: '48px', background: 'linear-gradient(135deg, #D4AF37, #FFDF00)',
                        borderRadius: '12px', margin: '0 auto 1rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(99,102,241,0.3)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                        {isLogin ? 'Enter your details to access RetailIQ' : 'Sign up to start analyzing your shop data'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px',
                        marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '0.875rem 1rem', background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px',
                                color: 'white', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            placeholder="retail@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%', padding: '0.875rem 1rem', background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px',
                                color: 'white', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.875rem', marginTop: '0.5rem',
                            background: 'linear-gradient(to right, #D4AF37, #FFDF00)',
                            border: 'none', borderRadius: '8px', color: 'white',
                            fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.1s'
                        }}
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none', border: 'none', color: '#94a3b8',
                            fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div >
    );
}
