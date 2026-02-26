import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sun, Train, Briefcase, Utensils, Laptop, Coffee, Mic, Send, Edit3 } from 'lucide-react';
import './Timeline.css';

export const Timeline: React.FC = () => {
    return (
        <div className="timeline-page">
            {/* Header */}
            <header className="page-header">
                <button className="icon-button"><ChevronLeft size={24} /></button>
                <h2 className="page-title">今日の振り返り</h2>
                <button className="icon-button"><Calendar size={24} /></button>
            </header>

            {/* Date Navigator */}
            <div className="date-navigator">
                <div className="month-selector">
                    <ChevronLeft size={16} className="text-muted" />
                    <span className="month-text">2023年10月</span>
                    <ChevronRight size={16} className="text-muted" />
                </div>

                <div className="days-row">
                    {['月', '火', '水', '木', '金', '土', '日'].map((day, idx) => (
                        <div key={idx} className="day-col">
                            <span className="day-name">{day}</span>
                            <div className={`day-number ${day === '木' ? 'active' : ''}`}>
                                {idx + 2}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="timeline-scroll-area">
                <div className="vertical-timeline-container">
                    <div className="timeline-vertical-line"></div>

                    {/* Event 1 */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper">
                            <Sun size={18} className="timeline-icon" />
                        </div>
                        <div className="timeline-card">
                            <div className="card-top">
                                <span className="event-time text-accent">07:00</span>
                                <span className="event-more">...</span>
                            </div>
                            <h3 className="event-title">起床・朝のルーティン</h3>
                            <span className="event-location text-muted">自宅</span>
                        </div>
                    </div>

                    {/* Event 2 */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper">
                            <Train size={18} className="timeline-icon" />
                        </div>
                        <div className="timeline-card">
                            <div className="card-top">
                                <span className="event-time text-muted">08:00 - 09:00</span>
                            </div>
                            <h3 className="event-title">移動・読書</h3>
                            <span className="event-location text-muted">電車内</span>
                        </div>
                    </div>

                    {/* Event 3 (Work) */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper border-accent">
                            <Briefcase size={18} className="timeline-icon text-accent" />
                        </div>
                        <div className="timeline-card border-accent-left">
                            <div className="card-top">
                                <span className="event-time text-accent">09:00 - 12:00</span>
                            </div>
                            <h3 className="event-title">仕事：プロジェクトA</h3>
                            <span className="event-location text-muted">オフィス - 会議室</span>
                        </div>
                    </div>

                    {/* Event 4 (Lunch) */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper border-green">
                            <Utensils size={18} className="timeline-icon text-green" />
                        </div>
                        <div className="timeline-card border-none">
                            <div className="card-top">
                                <span className="event-time text-muted">12:00 - 13:00</span>
                            </div>
                            <h3 className="event-title">昼食</h3>
                            <span className="event-location text-muted">カフェテラス</span>
                        </div>
                    </div>

                    {/* Event 5 (Focus) */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper border-accent">
                            <Laptop size={18} className="timeline-icon text-accent" />
                        </div>
                        <div className="timeline-card border-accent-left">
                            <div className="card-top">
                                <span className="event-time text-accent">13:00 - 18:00</span>
                            </div>
                            <h3 className="event-title">集中作業・コーディング</h3>
                            <span className="event-location text-muted">オフィス - デスク</span>
                            <div className="event-tags">
                                <span className="tag">UI Design</span>
                                <span className="tag">Frontend</span>
                            </div>
                        </div>
                    </div>

                    {/* Event 6 (Dinner) */}
                    <div className="timeline-event">
                        <div className="timeline-icon-wrapper border-orange">
                            <Coffee size={18} className="timeline-icon text-orange" />
                        </div>
                        <div className="timeline-card">
                            <div className="card-top">
                                <span className="event-time text-muted">19:00</span>
                            </div>
                            <h3 className="event-title">夕食</h3>
                            <span className="event-location text-muted">自宅</span>
                        </div>
                    </div>
                </div>

                {/* Daily Memo */}
                <div className="daily-memo-section">
                    <div className="memo-header">
                        <Edit3 size={18} className="text-accent" />
                        <h3>Daily Memo</h3>
                    </div>
                    <div className="memo-box">
                        <p className="memo-placeholder text-muted">
                            今日はどんな一日でしたか？気づきや反省を記録しましょう...
                        </p>
                        <div className="memo-actions">
                            <button className="memo-circle-btn bg-dark">
                                <Mic size={18} />
                            </button>
                            <button className="memo-square-btn bg-accent">
                                <Send size={18} color="#fff" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
