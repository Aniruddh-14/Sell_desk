import React from 'react';
import { motion } from 'framer-motion';

const metrics = [
    { label: 'Published pages', value: '12', detail: '+3 updated this week' },
    { label: 'Conversion rate', value: '4.8%', detail: 'Above portfolio average' },
    { label: 'Active themes', value: '03', detail: 'Signature, Modern, Local' },
    { label: 'Mobile score', value: '96/100', detail: 'Optimized for launch traffic' },
];

const sections = [
    {
        title: 'Hero banner',
        status: 'Ready',
        description: 'Premium first impression with headline, CTA pair, and featured offer placement.',
    },
    {
        title: 'Best sellers grid',
        status: 'Updated',
        description: 'Highlights top moving products with margin-aware sorting and trust badges.',
    },
    {
        title: 'About the brand',
        status: 'Needs review',
        description: 'Story section aligned to franchise voice guidelines and regional messaging.',
    },
    {
        title: 'Testimonials strip',
        status: 'Ready',
        description: 'Customer proof block with ratings, founder quote, and local market snapshots.',
    },
    {
        title: 'Store locator footer',
        status: 'Draft',
        description: 'Geo-aware branch details, opening hours, contact links, and booking prompts.',
    },
];

const featurePills = [
    'SEO schema synced',
    'Inventory feed connected',
    'Brand-safe copy approved',
    'Mobile responsive',
    'Payments ready',
    'Franchise locations linked',
    'Analytics pixel active',
    'Forms routed to CRM',
];

export default function WebsiteBuilderPage() {
    return (
        <div className="classic-page">
            <motion.section
                className="page-header classic-hero"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <div>
                    <div className="page-eyebrow">Storefront Builder</div>
                    <div className="page-title">Shape a premium website experience for every market.</div>
                    <p className="page-subtitle">
                        Assemble sections, refine merchandising blocks, and preview the live storefront before publishing it across your SellDesk network.
                    </p>
                </div>

                <div className="page-actions">
                    <button className="btn btn-ghost" type="button">Save draft</button>
                    <button className="btn btn-gold" type="button">Publish storefront</button>
                </div>
            </motion.section>

            <motion.section
                className="metrics-grid classic-metrics-grid"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            >
                {metrics.map((metric, index) => (
                    <div
                        className="metric-card classic-surface"
                        key={metric.label}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="metric-label">{metric.label}</div>
                        <div className="metric-value">{metric.value}</div>
                        <p className="metric-change">{metric.detail}</p>
                    </div>
                ))}
            </motion.section>

            <motion.section
                className="grid2 classic-split-grid"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14, ease: 'easeOut' }}
            >
                <div className="card classic-surface">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">Page structure</div>
                            <div className="section-title">Template blocks and content sections</div>
                        </div>
                        <span className="tag">6 blocks synced</span>
                    </div>

                    <div className="website-builder-list">
                        {sections.map((section, index) => (
                            <div className="website-builder-item" key={section.title}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div>
                                        <div className="tag" style={{ marginBottom: '0.65rem' }}>
                                            Block {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{section.title}</h3>
                                    </div>
                                    <span className="tag">{section.status}</span>
                                </div>
                                <p style={{ margin: '0.75rem 0 0', color: 'var(--text2)', lineHeight: 1.7 }}>{section.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card classic-surface">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">Live preview</div>
                            <div className="section-title">Signature storefront canvas</div>
                        </div>
                        <span className="tag">Desktop / 1440px</span>
                    </div>

                    <div className="website-preview-shell">
                        <div className="website-preview-toolbar">
                            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span className="tag">Preview</span>
                                <span className="tag">Theme: Signature</span>
                            </div>
                            <span className="tag">Auto-saved 2m ago</span>
                        </div>

                        <div className="website-preview-canvas">
                            <div className="classic-surface" style={{ padding: '1.1rem', borderRadius: '16px' }}>
                                <div className="page-eyebrow" style={{ marginBottom: '0.4rem' }}>SellDesk flagship collection</div>
                                <h3 style={{ margin: 0, fontSize: '1.45rem' }}>
                                    A polished storefront built for trust, conversion, and local reach.
                                </h3>
                                <p style={{ margin: '0.8rem 0 1rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                                    Launch seasonal offers, showcase best sellers, and connect nearby customers to the right branch in one premium experience.
                                </p>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <button className="btn btn-gold" type="button">Shop collection</button>
                                    <button className="btn btn-ghost" type="button">Find a location</button>
                                </div>
                            </div>

                            <div className="classic-surface" style={{ padding: '1rem', borderRadius: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.9rem' }}>
                                    {['Starter Kit', 'Regional Favorite', 'Premium Bundle'].map((item) => (
                                        <div key={item} style={{ borderRadius: '14px', padding: '0.9rem', background: 'rgba(255,255,255,0.55)' }}>
                                            <div className="tag" style={{ marginBottom: '0.6rem' }}>Featured</div>
                                            <div style={{ fontWeight: 600 }}>{item}</div>
                                            <div style={{ marginTop: '0.35rem', color: 'var(--text2)' }}>Optimized for storefront lift</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="classic-surface" style={{ padding: '1rem', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <div className="section-eyebrow">Trust and operations</div>
                                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>Store locator, reviews, and fulfillment details</div>
                                    </div>
                                    <span className="tag">Ready to publish</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="card classic-surface"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow">Platform readiness</div>
                        <div className="section-title">Feature and publishing status</div>
                    </div>
                    <span className="tag">All systems checked</span>
                </div>

                <div className="feature-pill-row">
                    {featurePills.map((pill) => (
                        <span className="tag" key={pill}>{pill}</span>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}