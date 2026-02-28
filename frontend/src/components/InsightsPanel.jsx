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
                    <h2>✨ AI Insights</h2>
                    <p>Gemini is analyzing your data...</p>
                </div>
                <div className="loading-spinner" />
                <p className="loading-text">Generating smart recommendations...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>✨ AI Insights</h2>
                <p>Smart recommendations powered by Google Gemini</p>
            </div>

            {/* Actions */}
            <div className="insights-actions">
                <select
                    className="festival-select"
                    value={festival}
                    onChange={handleFestivalChange}
                    id="festival-select"
                >
                    <option value="">All Festivals</option>
                    <option value="Diwali"> Diwali</option>
                    <option value="Holi"> Holi</option>
                    <option value="Navratri"> Navratri</option>
                    <option value="Eid"> Eid</option>
                    <option value="Christmas"> Christmas</option>
                    <option value="Pongal"> Pongal</option>
                    <option value="Raksha Bandhan"> Raksha Bandhan</option>
                </select>
                <button
                    className="btn btn-primary"
                    onClick={() => loadInsights()}
                    id="refresh-insights"
                >
                    Regenerate Insights
                </button>
            </div>

            {insights && (
                <div className="insights-grid">
                    {/* Stock More */}
                    {insights.stock_more?.length > 0 && (
                        <div className="glass-card insight-card stock-more animate-in">
                            <div className="insight-card-header">
                                <h3>Products to Stock More</h3>
                            </div>
                            <ul className="insight-list">
                                {insights.stock_more.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Products to Avoid */}
                    {insights.products_to_avoid?.length > 0 && (
                        <div className="glass-card insight-card avoid animate-in">
                            <div className="insight-card-header">
                                <h3>Products to Avoid</h3>
                            </div>
                            <ul className="insight-list">
                                {insights.products_to_avoid.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Festival Recommendations */}
                    {insights.festival_recommendations?.length > 0 && (
                        <div className="glass-card insight-card festival animate-in">
                            <div className="insight-card-header">
                                <h3>Festival Recommendations</h3>
                            </div>
                            <ul className="insight-list">
                                {insights.festival_recommendations.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* General Insights */}
                    {insights.general_insights?.length > 0 && (
                        <div className="glass-card insight-card general animate-in">
                            <div className="insight-card-header">
                                <h3>Business Insights</h3>
                            </div>
                            <ul className="insight-list">
                                {insights.general_insights.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
