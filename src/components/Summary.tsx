import { ChevronLeft, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, subDays, format, parseISO } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
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
    const [timeTab, setTimeTab] = useState<'today' | 'week' | 'month'>('week');

    // Simulate insight updates
    const insights = [
        "午後の学習効率が高い傾向があります。",
        "睡眠時間が目標に達していません。",
        "昨日はよく集中できていましたね！",
        "この調子で習慣を継続しましょう。"
    ];
    const [insightIdx, setInsightIdx] = useState(0);

    const handleNextInsight = () => {
        setInsightIdx((prev) => (prev + 1) % insights.length);
        toast.success('新しいインサイトを読み込みました');
    };

    // 1. Gather events for the selected period
    const targetDate = parseISO(state.selectedDate);

    const filteredEvents = state.events.filter(ev => {
        const evDate = parseISO(ev.date);
        if (timeTab === 'today') {
            return ev.date === state.selectedDate;
        } else if (timeTab === 'week') {
            const start = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
            const end = endOfWeek(targetDate, { weekStartsOn: 1 });
            return isWithinInterval(evDate, { start, end });
        } else {
            const start = startOfMonth(targetDate);
            const end = endOfMonth(targetDate);
            return isWithinInterval(evDate, { start, end });
        }
    });

    // 2. Compute aggregate time per category in minutes
    const categoryMinutes: Record<string, number> = {
        work: 0,
        sleep: 0,
        study: 0,
        free: 0
    };

    filteredEvents.forEach(ev => {
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

    // 5. Weekly Line Chart Logic (last 7 days from selected date)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(targetDate, 6 - i);
        return {
            dateStr: format(d, 'yyyy-MM-dd'),
            dayStr: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
        };
    });

    const weeklyData = last7Days.map(dayObj => {
        const dayEvents = state.events.filter(ev => ev.date === dayObj.dateStr);
        let totalMins = 0;
        dayEvents.forEach(ev => {
            if (!ev.startTime || !ev.endTime) return;
            const startMins = getMinutesFromStrictTime(ev.startTime);
            const endMins = getMinutesFromStrictTime(ev.endTime);
            totalMins += Math.max(0, endMins - startMins);
        });
        return {
            ...dayObj,
            totalMins,
            hours: totalMins / 60
        };
    });

    const maxHours = Math.max(...weeklyData.map(d => d.hours), 1); // Avoid div by 0

    // Build SVG path
    // Width 100, Height 40. Start at x=0 to x=100. y=40 is 0 hours, y=5 is maxHours (leaving 5px padding)
    const points = weeklyData.map((d, i) => {
        const x = (i / 6) * 100;
        const y = 40 - (d.hours / maxHours) * 35;
        return { x, y };
    });

    // Create curved path
    const createPath = (pts: { x: number, y: number }[]) => {
        if (pts.length === 0) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const curr = pts[i];
            const cpX = (prev.x + curr.x) / 2;
            d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
        }
        return d;
    };

    const strokePath = createPath(points);
    const fillPath = `${strokePath} L 100 40 L 0 40 Z`;

    return (
        <div className="summary-page">
            {/* Header */}
            <header className="page-header">
                <button className="icon-button" onClick={() => toast.info('戻る機能は準備中です')}><ChevronLeft size={24} /></button>
                <h2 className="page-title">分析ダッシュボード</h2>
                <button className="icon-button" onClick={() => toast.info('カレンダー確認は準備中です')}><Calendar size={24} /></button>
            </header>

            <div className="summary-scroll-area">

                {/* Toggle Tabs */}
                <div className="time-toggle">
                    <button
                        className={`toggle-btn ${timeTab === 'today' ? 'active' : ''}`}
                        onClick={() => setTimeTab('today')}
                    >今日</button>
                    <button
                        className={`toggle-btn ${timeTab === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeTab('week')}
                    >今週</button>
                    <button
                        className={`toggle-btn ${timeTab === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeTab('month')}
                    >今月</button>
                </div>

                {/* Time Distribution Card */}
                <div className="analysis-card pb-8">
                    <div className="card-header align-center justify-between">
                        <h3 className="card-title-with-dot">
                            時間配分 <span className="blue-dot"></span>
                        </h3>
                        <button
                            className="pill-action-btn"
                            onClick={() => toast.info('詳細レポートは準備中です')}
                        >
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
                        <span className="insight-desc">{insights[insightIdx]}</span>
                    </div>
                    <button className="insight-action-btn" onClick={handleNextInsight}>
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Weekly Report Graph */}
                <div className="report-header">
                    <h3 className="section-title">週次レポート</h3>
                    <span className="status-pill-small">最新</span>
                </div>

                <div className="analysis-card mt-2">
                    <div className="line-chart-mock">
                        <svg viewBox="0 0 100 40" className="chart-svg">
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                                </linearGradient>
                            </defs>
                            <path d={fillPath} fill="url(#chartGrad)" />
                            <path d={strokePath} fill="none" stroke="#3b82f6" strokeWidth="1.5" />

                            {points.map((pt, i) => (
                                <circle key={i} cx={pt.x} cy={pt.y} r="1.5" fill="#1a1f2e" stroke="#3b82f6" strokeWidth="0.8" />
                            ))}
                        </svg>
                        <div className="chart-labels-x">
                            {weeklyData.map((d, i) => (
                                <span key={i} className={i === 6 ? 'active' : ''}>{d.dayStr}</span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
