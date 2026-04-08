import React from 'react';
import { motion } from 'framer-motion';

const channels = [
    {
        icon: '▶',
        platform: 'YouTube',
        name: 'Pre-Roll Ads',
        desc: 'Target people within 5km of your shop. Effective for cafes and restaurants promoting daily specials or new menus.',
        color: 'var(--red)',
        bg: 'var(--red-dim)',
    },
    {
        icon: '◈',
        platform: 'Instagram & Facebook',
        name: 'Geo-Targeted Creatives',
        desc: 'Managed via Meta Ads API. Set a budget and SellDesk creates and runs the campaign automatically.',
        color: 'var(--blue)',
        bg: 'var(--blue-dim)',
    },
    {
        icon: '✉',
        platform: 'SMS Blasts',
        name: 'Bulk SMS Campaigns',
        desc: 'Send to local mobile numbers via telecom partners. Used for flash sales, festive offers, and loyalty reminders.',
        color: 'var(--green)',
        bg: 'var(--green-dim)',
    },
    {
        icon: '💬',
        platform: 'WhatsApp',
        name: 'WhatsApp Campaigns',
        desc: 'Promotional messages to existing customers who have transacted before. Opt-in based, high open rate.',
        color: 'var(--green)',
        bg: 'var(--green-dim)',
    },
    {
        icon: '🌐',
        platform: 'Business Website',
        name: 'Digital Storefront',
        desc: 'Auto-generated one-page site with menu, offers, Google Maps, and contact. Acts as a 24/7 digital storefront.',
        color: 'var(--gold)',
        bg: 'var(--gold-dim)',
    },
    {
        icon: '🧾',
        platform: 'Billing Screen Ads',
        name: 'Brand Placements',
        desc: 'FMCG brands (Amul, Nestle, Britannia) pay to display promotions on the billing screen and printed receipt footer.',
        color: 'var(--amber)',
        bg: 'var(--amber-dim)',
    },
];

const revenueStreams = [
    { source: 'Ad Spend Markup', model: 'Shop spends ₹5,000 via platform; charged ₹6,000', margin: '15–20%' },
    { source: 'FMCG Brand Deals', model: 'Brands pay for placement on billing screens of relevant shops', margin: 'High — direct contracts' },
    { source: 'Website Hosting Upsell', model: '₹299/month recurring for hosting and updates', margin: '90%+' },
    { source: 'SMS Gateway Markup', model: 'Resell bulk SMS at a margin over gateway cost', margin: '25–35%' },
];

export default function AdStudioPage() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-eyebrow">Coming Soon</div>
                    <div className="page-title">Advertisement Engine</div>
                </div>
                <span className="tag tag-gold" style={{ fontSize: '12px', padding: '6px 16px' }}>🚀 In Development</span>
            </div>

            <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--gold-border)', background: 'var(--gold-glow)' }}>
                <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0, lineHeight: 1.7 }}>
                    Every shop on SellDesk becomes a <strong style={{ color: 'var(--gold)' }}>local ad node</strong>. The advertisement engine lets shop owners run paid campaigns and lets FMCG brands reach hyper-local audiences — all from one platform.
                </p>
            </div>

            {/* Channel Cards */}
            <div className="card-title" style={{ marginBottom: '16px' }}>Ad Channels</div>
            <div className="ad-channel-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {channels.map((ch, i) => (
                    <motion.div
                        key={ch.platform}
                        className="ad-channel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                            <span className="tag" style={{ background: 'var(--card2)', color: 'var(--text3)', fontSize: '9px' }}>Coming Soon</span>
                        </div>
                        <div className="ad-channel-icon" style={{ width: 44, height: 44, borderRadius: 10, background: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{ch.icon}</div>
                        <div className="ad-channel-platform">{ch.platform}</div>
                        <div className="ad-channel-name">{ch.name}</div>
                        <div className="ad-channel-desc">{ch.desc}</div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Streams Table */}
            <motion.div
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ marginTop: '8px' }}
            >
                <div className="card-title">Ad Revenue Streams</div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Model</th>
                                <th>Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueStreams.map(r => (
                                <tr key={r.source}>
                                    <td style={{ fontWeight: 500, color: 'var(--text)' }}>{r.source}</td>
                                    <td>{r.model}</td>
                                    <td><span className="tag tag-green">{r.margin}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
