import React from 'react';
import { ChevronLeft, Calendar, ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';
import './Summary.css';

export const Summary: React.FC = () => {
    return (
        <div className="summary-page">
            {/* Header */}
            <header className="page-header">
                <button className="icon-button"><ChevronLeft size={24} /></button>
                <h2 className="page-title">分析ダッシュボード</h2>
                <button className="icon-button"><Calendar size={24} /></button>
            </header>

            <div className="summary-scroll-area">

                {/* Toggle Tabs */}
                <div className="time-toggle">
                    <button className="toggle-btn">今日</button>
                    <button className="toggle-btn active">今週</button>
                    <button className="toggle-btn">今月</button>
                </div>

                {/* Time Distribution Card */}
                <div className="analysis-card pb-8">
                    <div className="card-header align-center justify-between">
                        <h3 className="card-title-with-dot">
                            時間配分 <span className="blue-dot"></span>
                        </h3>
                        <button className="pill-action-btn">
                            詳細 <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Donut Chart Mockup */}
                    <div className="donut-chart-container">
                        <div className="donut-ring">
                            <div className="donut-segment seg-work"></div>
                            <div className="donut-segment seg-sleep"></div>
                            <div className="donut-segment seg-study"></div>
                            <div className="donut-segment seg-other"></div>
                            <div className="donut-inner">
                                <span className="donut-value">42<span className="donut-unit">h</span></span>
                                <span className="donut-label pill-badge">合計時間</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend Items */}
                    <div className="legend-list">

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-blue"></span>
                                <span className="legend-name">仕事</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">40%</span>
                                <div className="legend-badge">16h 48m</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-cyan"></span>
                                <span className="legend-name">睡眠</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">25%</span>
                                <div className="legend-badge">10h 30m</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-purple"></span>
                                <span className="legend-name">学習</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">10%</span>
                                <div className="legend-badge">4h 12m</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-grey"></span>
                                <span className="legend-name">その他</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">25%</span>
                                <div className="legend-badge">10h 30m</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Insight Card */}
                <div className="insight-card">
                    <div className="insight-content">
                        <h4 className="insight-title">
                            <span className="emoji">💡</span> 改善のヒントを表示
                        </h4>
                        <span className="insight-desc">あなたのデータを基にしたアドバイス</span>
                    </div>
                    <button className="insight-action-btn">
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Weekly Report Graph */}
                <div className="report-header">
                    <h3 className="section-title">週次レポート</h3>
                    <span className="status-pill-small">最新</span>
                </div>

                <div className="analysis-card mt-2">
                    {/* SVG Line Chart mock */}
                    <div className="line-chart-mock">
                        <svg viewBox="0 0 100 40" className="chart-svg">
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                                </linearGradient>
                            </defs>
                            <path d="M 0 30 Q 10 30 20 20 T 40 10 T 60 25 T 80 30 T 100 30 L 100 40 L 0 40 Z" fill="url(#chartGrad)" />
                            <path d="M 0 30 Q 10 30 20 20 T 40 10 T 60 25 T 80 30 T 100 30" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

                            <circle cx="20" cy="20" r="1.5" fill="#1a1f2e" stroke="#3b82f6" strokeWidth="0.8" />
                            <circle cx="40" cy="10" r="1.5" fill="#1a1f2e" stroke="#3b82f6" strokeWidth="0.8" />
                            <circle cx="60" cy="25" r="1.5" fill="#1a1f2e" stroke="#3b82f6" strokeWidth="0.8" />
                        </svg>
                        <div className="chart-labels-x">
                            <span>月</span><span>火</span><span className="active">水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
