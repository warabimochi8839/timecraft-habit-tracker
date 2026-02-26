
import { ChevronLeft, ChevronRight, Calendar, Sun, Briefcase, Laptop, Coffee, Mic, Send, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, addDays, subDays } from 'date-fns';
import './Timeline.css';

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'sleep': return <Sun size={18} className="timeline-icon text-muted" />;
        case 'work': return <Briefcase size={18} className="timeline-icon text-accent" />;
        case 'study': return <Laptop size={18} className="timeline-icon text-purple" />;
        case 'free': return <Coffee size={18} className="timeline-icon text-orange" />;
        default: return <Edit3 size={18} className="timeline-icon text-muted" />;
    }
};

const getCategoryColorClass = (category: string) => {
    switch (category) {
        case 'work': return 'border-accent';
        case 'study': return 'border-purple';
        case 'free': return 'border-orange';
        case 'sleep': return 'border-muted';
        default: return '';
    }
};

export const Timeline: React.FC = () => {
    const { state, setSelectedDate } = useApp();

    const todaysEvents = state.events
        .filter(ev => ev.date === state.selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const currentDateObj = new Date(state.selectedDate);
    const formattedMonth = format(currentDateObj, 'yyyy年MM月');

    const handlePrevDay = () => setSelectedDate(format(subDays(currentDateObj, 1), 'yyyy-MM-dd'));
    const handleNextDay = () => setSelectedDate(format(addDays(currentDateObj, 1), 'yyyy-MM-dd'));
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
                    <button className="icon-button" onClick={handlePrevDay}>
                        <ChevronLeft size={16} className="text-muted" />
                    </button>
                    <span className="month-text">{formattedMonth}</span>
                    <button className="icon-button" onClick={handleNextDay}>
                        <ChevronRight size={16} className="text-muted" />
                    </button>
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

                    {todaysEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            予定がありません。<br />下の「＋」ボタンから追加してください。
                        </div>
                    ) : (
                        todaysEvents.map((event) => (
                            <div key={event.id} className="timeline-event">
                                <div className={`timeline-icon-wrapper ${getCategoryColorClass(event.category)}`}>
                                    {getCategoryIcon(event.category)}
                                </div>
                                <div className={`timeline-card ${event.category === 'work' ? 'border-accent-left' : ''}`}>
                                    <div className="card-top">
                                        <span className={`event-time ${event.category === 'work' ? 'text-accent' : 'text-muted'}`}>
                                            {event.startTime} - {event.endTime}
                                        </span>
                                        <span className="event-more">...</span>
                                    </div>
                                    <h3 className="event-title">{event.title}</h3>
                                    {event.memo && <span className="event-location text-muted">{event.memo}</span>}

                                    {event.tags && event.tags.length > 0 && (
                                        <div className="event-tags">
                                            {event.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
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
