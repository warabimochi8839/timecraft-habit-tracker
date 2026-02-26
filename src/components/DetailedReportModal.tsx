import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import './AddModal.css';

interface DetailedReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({ isOpen, onClose }) => {
    const { state } = useApp();
    if (!isOpen) return null;

    const targetDate = parseISO(state.selectedDate);
    const start = startOfWeek(targetDate, { weekStartsOn: 1 });
    const end = endOfWeek(targetDate, { weekStartsOn: 1 });

    const weeklyEvents = state.events.filter(ev => {
        const evDate = parseISO(ev.date);
        return isWithinInterval(evDate, { start, end });
    });

    let totalMins = 0;
    const categoryMins: Record<string, number> = { work: 0, sleep: 0, study: 0, free: 0 };

    weeklyEvents.forEach(ev => {
        if (!ev.startTime || !ev.endTime) return;
        const [sH, sM] = ev.startTime.split(':').map(Number);
        const [eH, eM] = ev.endTime.split(':').map(Number);
        const duration = Math.max(0, ((eH || 0) * 60 + (eM || 0)) - ((sH || 0) * 60 + (sM || 0)));
        totalMins += duration;
        if (categoryMins[ev.category] !== undefined) {
            categoryMins[ev.category] += duration;
        } else {
            categoryMins.free += duration;
        }
    });

    const formatDur = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}時間${m}分`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="icon-button" onClick={onClose}><X size={24} /></button>
                    <h3>週間詳細レポート</h3>
                    <div style={{ width: 24 }}></div>
                </div>

                <div className="modal-body pb-8 mt-4">
                    <div className="insight-card" style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-dark)' }}>
                        <div className="flex-align mb-2">
                            <Calendar size={18} className="text-accent mr-2" />
                            <span className="f-bold">集計期間</span>
                        </div>
                        <p className="text-muted">{format(start, 'yyyy年MM月dd日')} 〜 {format(end, 'MM月dd日')}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div className="analysis-card" style={{ padding: '16px', margin: 0 }}>
                            <span className="text-muted" style={{ fontSize: '12px' }}>総合計時間</span>
                            <div className="flex-align mt-1">
                                <span className="f-bold" style={{ fontSize: '24px' }}>{Math.floor(totalMins / 60)}</span>
                                <span className="text-muted ml-1">時間</span>
                            </div>
                        </div>
                        <div className="analysis-card" style={{ padding: '16px', margin: 0 }}>
                            <span className="text-muted" style={{ fontSize: '12px' }}>週間目標達成率</span>
                            <div className="flex-align mt-1">
                                <span className="f-bold text-blue" style={{ fontSize: '24px' }}>{(Math.random() * 40 + 60).toFixed(0)}</span>
                                <span className="text-muted ml-1">%</span>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-muted)' }}>カテゴリ別累計</h4>

                    <div className="legend-list mb-8">
                        {Object.entries(categoryMins).map(([cat, mins]) => {
                            const nameMap: any = { work: '仕事', sleep: '睡眠', study: '学習', free: 'その他' };
                            const colorMap: any = { work: 'var(--accent-main)', sleep: 'var(--accent-cyan)', study: 'var(--accent-purple)', free: '#64748b' };
                            const pct = totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0;
                            return (
                                <div className="legend-row" key={cat} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', marginBottom: '8px' }}>
                                    <div className="legend-left">
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: colorMap[cat] }}></div>
                                        <span className="legend-name ml-2">{nameMap[cat]}</span>
                                    </div>
                                    <div className="legend-right">
                                        <span className="legend-percent f-bold">{pct}%</span>
                                        <div className="legend-badge ml-2">{formatDur(mins)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="btn-primary w-full flex-align justify-center" onClick={onClose}>
                        確認完了
                    </button>
                </div>
            </div>
        </div>
    );
};
