import { ChevronLeft, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Summary.css';

// Helper to convert HH:MM to minutes
const getMinutesFromStrictTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

// Helper to format minutes to "Xh Ym"
const formatDuration = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
};

export const Summary: React.FC = () => {
    const { state } = useApp();

    // 1. Gather events for the selected day
    const todaysEvents = state.events.filter(ev => ev.date === state.selectedDate);

    // 2. Compute aggregate time per category in minutes
    const categoryMinutes: Record<string, number> = {
        work: 0,
        sleep: 0,
        study: 0,
        free: 0
    };

    todaysEvents.forEach(ev => {
        if (!ev.startTime || !ev.endTime) return;
        const startMins = getMinutesFromStrictTime(ev.startTime);
        const endMins = getMinutesFromStrictTime(ev.endTime);
        const duration = Math.max(0, endMins - startMins);
        if (categoryMinutes[ev.category] !== undefined) {
            categoryMinutes[ev.category] += duration;
        } else {
            categoryMinutes.free += duration; // Fallback to free/other
        }
    });

    const totalTrackedMins = Object.values(categoryMinutes).reduce((a, b) => a + b, 0);

    // 3. Calculate percentages
    const getPct = (mins: number) => totalTrackedMins === 0 ? 0 : Math.round((mins / totalTrackedMins) * 100);

    const workPct = getPct(categoryMinutes.work);
    const sleepPct = getPct(categoryMinutes.sleep);
    const studyPct = getPct(categoryMinutes.study);
    const freePct = getPct(categoryMinutes.free);

    // 4. Build conic gradient for the donut chart based on degrees
    // Order: Work (main/blue), Sleep (cyan), Study (purple), Free/Other (gray/dark)
    // Actually the mock CSS used: cyan, purple, dark blue, accent
    let currentDeg = 0;
    const workDeg = (categoryMinutes.work / (totalTrackedMins || 1)) * 360;
    const sleepDeg = (categoryMinutes.sleep / (totalTrackedMins || 1)) * 360;
    const studyDeg = (categoryMinutes.study / (totalTrackedMins || 1)) * 360;

    // Build gradient string
    const gWork = `var(--accent-main) ${currentDeg}deg ${currentDeg += workDeg}deg`;
    const gSleep = `var(--accent-cyan) ${currentDeg}deg ${currentDeg += sleepDeg}deg`;
    const gStudy = `var(--accent-purple) ${currentDeg}deg ${currentDeg += studyDeg}deg`;
    const gFree = `#64748b ${currentDeg}deg 360deg`;

    const donutGradient = totalTrackedMins > 0
        ? `conic-gradient(${gWork}, ${gSleep}, ${gStudy}, ${gFree})`
        : `conic-gradient(#2a3447 0deg 360deg)`;
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
                        <div className="donut-ring" style={{ background: donutGradient }}>
                            <div className="donut-inner">
                                <span className="donut-value">
                                    {Math.floor(totalTrackedMins / 60)}
                                    <span className="donut-unit">h</span>
                                </span>
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
                                <span className="legend-percent f-bold">{workPct}%</span>
                                <div className="legend-badge">{formatDuration(categoryMinutes.work)}</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-cyan"></span>
                                <span className="legend-name">睡眠</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">{sleepPct}%</span>
                                <div className="legend-badge">{formatDuration(categoryMinutes.sleep)}</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-purple"></span>
                                <span className="legend-name">学習</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">{studyPct}%</span>
                                <div className="legend-badge">{formatDuration(categoryMinutes.study)}</div>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>

                        <div className="legend-row">
                            <div className="legend-left">
                                <span className="stat-dot dot-grey"></span>
                                <span className="legend-name">その他</span>
                            </div>
                            <div className="legend-right">
                                <span className="legend-percent f-bold">{freePct}%</span>
                                <div className="legend-badge">{formatDuration(categoryMinutes.free)}</div>
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
