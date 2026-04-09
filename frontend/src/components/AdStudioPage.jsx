import React from 'react';
import { motion } from 'framer-motion';
import './theme.css';

export default function AdStudioPage() {
    return (
        <div style={{ padding: '28px', background: 'var(--cream-bg)', color: 'var(--text-primary)', minHeight: '100vh', margin: '-32px -36px', borderRadius: '10px' }}>
            <div className="section-header">
                <div>
                    <div className="panel-eyebrow">Local Growth Engine</div>
                    <div className="panel-title">Ad Studio</div>
                </div>
                <button className="new-btn new-btn-gold">Launch Campaign</button>
            </div>

            {/* Budget overview */}
            <div className="g3" style={{ marginBottom: '16px' }}>
                <div className="new-metric">
                    <div className="new-metric-label">Monthly Ad Budget</div>
                    <div className="new-metric-val">₹8,500</div>
                    <div className="new-metric-sub blue">Across 4 channels</div>
                </div>
                <div className="new-metric">
                    <div className="new-metric-label">Estimated Reach</div>
                    <div className="new-metric-val">42,000</div>
                    <div className="new-metric-sub up">People in 5 km radius</div>
                </div>
                <div className="new-metric">
                    <div className="new-metric-label">FMCG Brand Earnings</div>
                    <div className="new-metric-val">₹1,200</div>
                    <div className="new-metric-sub up">From receipt placements</div>
                </div>
            </div>

            <div className="g2">
                <div className="ad-channel-card">
                    <div className="ad-ch-label">YouTube</div>
                    <div className="ad-ch-title">5 km Pre-roll</div>
                    <div className="ad-ch-desc">Promote daily specials to nearby customers with a simple budget cap. Video ads play before local viewers' content.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill active">Active</span>
                        <button className="campaign-btn">Edit Campaign</button>
                    </div>
                    <div className="ad-budget-row">Budget: <strong>₹2,000/mo</strong> · Reach: <strong>12,400</strong></div>
                </div>
                <div className="ad-channel-card">
                    <div className="ad-ch-label">Instagram + Facebook</div>
                    <div className="ad-ch-title">Geo-targeted creatives</div>
                    <div className="ad-ch-desc">Push one approved design across Meta channels without leaving the billing app. Carousel, stories, and reels formats.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill active">Active</span>
                        <button className="campaign-btn">Edit Campaign</button>
                    </div>
                    <div className="ad-budget-row">Budget: <strong>₹3,500/mo</strong> · Reach: <strong>18,600</strong></div>
                </div>
                <div className="ad-channel-card">
                    <div className="ad-ch-label">SMS</div>
                    <div className="ad-ch-title">Flash sale burst</div>
                    <div className="ad-ch-desc">Send quick, high-clarity sale alerts for busy hours and festive weekends to targeted local mobile numbers.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill paused">Paused</span>
                        <button className="campaign-btn">Resume</button>
                    </div>
                    <div className="ad-budget-row">Budget: <strong>₹1,500/mo</strong> · Sent: <strong>4,200 msgs</strong></div>
                </div>
                <div className="ad-channel-card">
                    <div className="ad-ch-label">WhatsApp</div>
                    <div className="ad-ch-title">Loyal customer follow-up</div>
                    <div className="ad-ch-desc">Reach past customers with consent-based offers and receipt-linked promotions. Personalised by purchase history.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill ready">Ready</span>
                        <button className="campaign-btn">Launch Now</button>
                    </div>
                    <div className="ad-budget-row">Budget: <strong>₹1,500/mo</strong> · List: <strong>890 contacts</strong></div>
                </div>
                <div className="ad-channel-card">
                    <div className="ad-ch-label">Receipt Footer</div>
                    <div className="ad-ch-title">FMCG brand placements</div>
                    <div className="ad-ch-desc">Brands like Amul, Nescafe, and Britannia pay to appear on your printed receipts. You earn passive income every month.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill active">Earning</span>
                        <button className="campaign-btn">View Brands</button>
                    </div>
                    <div className="ad-budget-row">Earning: <strong>₹800/mo</strong> · 2 brands active</div>
                </div>
                <div className="ad-channel-card">
                    <div className="ad-ch-label">Billing Screen</div>
                    <div className="ad-ch-title">Customer display ads</div>
                    <div className="ad-ch-desc">While the bill generates, the customer-facing screen shows brand promotions. A second revenue stream from your own hardware.</div>
                    <div className="ad-ch-status">
                        <span className="status-pill ready">Setup needed</span>
                        <button className="campaign-btn">Configure</button>
                    </div>
                    <div className="ad-budget-row">Potential: <strong>₹400/mo</strong> additional</div>
                </div>
            </div>
        </div>
    );
}
