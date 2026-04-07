import React, { useState, useEffect } from 'react';
import { getInsights } from '../api/client';

export default function InsightsPanel() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [festival, setFestival] = useState('');

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async (selectedFestival) => {
        setLoading(true);
        try {
            const data = await getInsights({
                festival: selectedFestival || festival || undefined,
            });
            setInsights(data);
        } catch (err) {
            console.error('Failed to load insights:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFestivalChange = (e) => {
        const val = e.target.value;
        setFestival(val);
        loadInsights(val);
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div>
                         <div className="page-eyebrow">Smart Recommendations</div>
                         <div className="page-title">AI Insights</div>
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                     <div style={{ color: 'var(--text3)' }}>Gemini is analyzing your data...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                     <div className="page-eyebrow">Smart Recommendations</div>
                     <div className="page-title">AI Insights</div>
                </div>
                <div className="page-actions">
                    <select
                        value={festival}
                        onChange={handleFestivalChange}
                        style={{ padding: '8px 12px', background: 'var(--navy3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
                    >
                        <option value="">All Festivals</option>
                        <option value="Diwali">Diwali</option>
                        <option value="Holi">Holi</option>
                        <option value="Navratri">Navratri</option>
                        <option value="Eid">Eid</option>
                        <option value="Christmas">Christmas</option>
                        <option value="Pongal">Pongal</option>
                        <option value="Raksha Bandhan">Raksha Bandhan</option>
                    </select>
                    <button className="btn btn-gold" onClick={() => loadInsights()}>Regenerate Insights</button>
                </div>
            </div>

            {insights && (
                <div className="grid2">
                    {/* Stock More */}
                    {insights.stock_more?.length > 0 && (
                        <div className="insight-block">
                            <div className="insight-header">
                                <div className="insight-icon green">📈</div>
                                <div className="insight-title">Products to Stock More</div>
                            </div>
                            <ul className="insight-body" style={{ margin: 0, paddingLeft: '24px' }}>
                                {insights.stock_more.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Products to Avoid */}
                    {insights.products_to_avoid?.length > 0 && (
                        <div className="insight-block">
                            <div className="insight-header">
                                <div className="insight-icon red">📉</div>
                                <div className="insight-title">Products to Avoid</div>
                            </div>
                            <ul className="insight-body" style={{ margin: 0, paddingLeft: '24px' }}>
                                {insights.products_to_avoid.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Festival Recommendations */}
                    {insights.festival_recommendations?.length > 0 && (
                        <div className="insight-block">
                            <div className="insight-header">
                                <div className="insight-icon gold">🎉</div>
                                <div className="insight-title">Festival Recommendations</div>
                            </div>
                            <ul className="insight-body" style={{ margin: 0, paddingLeft: '24px' }}>
                                {insights.festival_recommendations.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* General Insights */}
                    {insights.general_insights?.length > 0 && (
                        <div className="insight-block">
                            <div className="insight-header">
                                <div className="insight-icon">💡</div>
                                <div className="insight-title">Business Insights</div>
                            </div>
                            <ul className="insight-body" style={{ margin: 0, paddingLeft: '24px' }}>
                                {insights.general_insights.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
