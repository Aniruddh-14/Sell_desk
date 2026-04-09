import React from 'react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Starter',
        price: '$49',
        subtitle: 'For single-location teams launching fast.',
        tag: 'Best for new operators',
        accent: 'Launch',
        features: [
            '1 active storefront with branded checkout',
            'Campaign calendar and basic automations',
            'Email support with setup checklist',
            'Core reporting for revenue, leads, and orders',
        ],
        cta: 'Start Starter',
    },
    {
        name: 'Growth',
        price: '$149',
        subtitle: 'For scaling teams that need better control.',
        tag: 'Most popular',
        accent: 'Scale',
        featured: true,
        features: [
            'Up to 5 locations with shared brand controls',
            'Advanced ad studio workflows and audience sync',
            'Team roles, approval flows, and conversion goals',
            'Weekly performance insights with benchmark tracking',
        ],
        cta: 'Upgrade to Growth',
    },
    {
        name: 'Franchise',
        price: '$399',
        subtitle: 'For multi-branch brands managing local execution.',
        tag: 'Enterprise-ready',
        accent: 'Govern',
        features: [
            'Unlimited locations with HQ governance tools',
            'Branch-level content, offer, and budget controls',
            'Launch playbooks, onboarding templates, and compliance review',
            'Priority support plus quarterly success planning',
        ],
        cta: 'Talk to sales',
    },
];

const addons = [
    {
        title: 'Managed Launch Concierge',
        detail: 'White-glove onboarding, migration support, and team training.',
        price: '$750 one-time',
    },
    {
        title: 'Creative Refresh Pack',
        detail: 'Quarterly ad and landing page creative tailored to your campaigns.',
        price: '$299 / quarter',
    },
    {
        title: 'Local SEO Sync',
        detail: 'Listings alignment, reputation prompts, and store metadata updates.',
        price: '$89 / month',
    },
    {
        title: 'Executive Reporting',
        detail: 'Monthly board-ready summaries with custom KPI narration.',
        price: '$199 / month',
    },
];

const benefits = [
    'No long-term contract required',
    'Switch plans as locations grow',
    'Brand-safe controls built in',
    'Secure billing and role-based access',
];

export default function PricingPlansPage() {
    return (
        <div className="classic-page">
            <motion.div
                className="page-header classic-hero"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <div>
                    <div className="page-eyebrow">Pricing Plans</div>
                    <div className="page-title">Premium tools for every stage of local growth.</div>
                    <p className="page-subtitle" style={{ maxWidth: '760px', marginTop: '10px' }}>
                        Choose a SellDesk plan designed for operators, scaling brands, and franchise HQ teams that need elegant control without enterprise friction.
                    </p>
                </div>

                <div className="page-actions">
                    <button className="btn btn-gold">Book a Guided Demo</button>
                </div>
            </motion.div>

            <motion.div
                className="card classic-surface"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45, ease: 'easeOut' }}
                style={{ marginBottom: '24px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                        <div className="page-eyebrow" style={{ marginBottom: '6px' }}>Included with every plan</div>
                        <div className="card-title" style={{ marginBottom: 0 }}>Refined operations, faster launches, clearer visibility.</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {benefits.map((item) => (
                            <span key={item} className="tag">{item}</span>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="pricing-showcase-grid">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        className="card classic-surface"
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.08, duration: 0.45, ease: 'easeOut' }}
                        style={{
                            borderColor: plan.featured ? 'var(--gold-border)' : undefined,
                            background: plan.featured ? 'var(--gold-glow)' : undefined,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '18px' }}>
                            <div>
                                <div className="page-eyebrow" style={{ marginBottom: '6px' }}>{plan.accent}</div>
                                <div className="card-title" style={{ marginBottom: '4px' }}>{plan.name}</div>
                            </div>
                            <span className={`tag ${plan.featured ? 'tag-gold' : ''}`}>{plan.tag}</span>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '40px', fontWeight: 700, color: 'var(--text)' }}>{plan.price}</span>
                                <span style={{ color: 'var(--text3)' }}>/ month</span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text2)', lineHeight: 1.7 }}>{plan.subtitle}</p>
                        </div>

                        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                            {plan.features.map((feature) => (
                                <div key={feature} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span className="tag" style={{ minWidth: 'fit-content' }}>✓</span>
                                    <span style={{ color: 'var(--text2)', lineHeight: 1.6 }}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`btn ${plan.featured ? 'btn-gold' : 'btn-ghost'}`}>{plan.cta}</button>
                    </motion.div>
                ))}
            </div>

            <div className="grid2" style={{ marginTop: '24px' }}>
                <motion.div
                    className="card classic-surface"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.45, ease: 'easeOut' }}
                >
                    <div className="page-eyebrow">Plan Comparison</div>
                    <div className="card-title">How teams typically choose.</div>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-label">Starter</div>
                            <strong>Best for focused execution</strong>
                            <p style={{ margin: '8px 0 0', color: 'var(--text2)', lineHeight: 1.7 }}>
                                Ideal when one operator needs polished campaigns, storefront basics, and dependable reporting.
                            </p>
                        </div>

                        <div className="metric-card">
                            <div className="metric-label">Growth</div>
                            <strong>Best for cross-functional teams</strong>
                            <p style={{ margin: '8px 0 0', color: 'var(--text2)', lineHeight: 1.7 }}>
                                Recommended for teams balancing more locations, approvals, and performance accountability.
                            </p>
                        </div>

                        <div className="metric-card">
                            <div className="metric-label">Franchise</div>
                            <strong>Best for HQ governance</strong>
                            <p style={{ margin: '8px 0 0', color: 'var(--text2)', lineHeight: 1.7 }}>
                                Built for brands coordinating branch compliance, shared creative, and local sales execution at scale.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="card classic-surface"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.45, ease: 'easeOut' }}
                >
                    <div className="page-eyebrow">Add-Ons</div>
                    <div className="card-title">Extend your operating stack.</div>

                    <div className="pricing-addon-grid">
                        {addons.map((addon) => (
                            <div key={addon.title} className="metric-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong>{addon.title}</strong>
                                    <span className="tag">{addon.price}</span>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text2)', lineHeight: 1.7 }}>{addon.detail}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="alert assurance-strip"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.45, ease: 'easeOut' }}
                style={{ marginTop: '24px' }}
            >
                <div>
                    <div className="page-eyebrow" style={{ marginBottom: '6px' }}>Assurance</div>
                    <div className="card-title" style={{ marginBottom: '8px' }}>
                        Every plan comes with a clean migration path, secure billing, and support that stays close to your team.
                    </div>
                    <p style={{ margin: 0, color: 'var(--text2)', lineHeight: 1.8, maxWidth: '920px' }}>
                        Start lean, scale confidently, and move into HQ-level controls without rebuilding your workflow. SellDesk keeps your brand standards, reporting logic, and location structure intact as you grow.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}