
import { ChevronLeft, ChevronRight, Calendar, Sun, Briefcase, Laptop, Coffee, Mic, Send, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, addDays, subDays } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditEventModal } from './EditEventModal';
import type { TimelineEvent } from '../types';
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
    const { state, setSelectedDate, addEvent } = useApp();
    const [isRecording, setIsRecording] = useState(false);
    const [memoText, setMemoText] = useState('');
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

    const todaysEvents = state.events
        .filter(ev => ev.date === state.selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const currentDateObj = new Date(state.selectedDate);
    const formattedMonth = format(currentDateObj, 'yyyy年MM月');

    const handlePrevDay = () => setSelectedDate(format(subDays(currentDateObj, 1), 'yyyy-MM-dd'));
    const handleNextDay = () => setSelectedDate(format(addDays(currentDateObj, 1), 'yyyy-MM-dd'));

    // Simulate recording
    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            toast.success('録音を完了しました');
            setMemoText(prev => prev + (prev ? ' ' : '') + '音声入力のテキスト...');
        } else {
            setIsRecording(true);
            toast('録音を開始しました...', { icon: <Mic size={16} className="text-accent" /> });
        }
    };

    // Send Daily Memo
    const handleSendMemo = () => {
        if (!memoText.trim()) {
            toast.error('メモを入力してください');
            return;
        }

        addEvent({
            title: 'Daily Memo',
            category: 'free',
            startTime: format(new Date(), 'HH:mm'), // current time roughly
            endTime: format(new Date(Date.now() + 30 * 60000), 'HH:mm'), // +30m
            date: state.selectedDate,
            memo: memoText,
            tags: ['Memo']
        });

        toast.success('メモを保存しました');
        setMemoText('');
    };

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
                    {['月', '火', '水', '木', '金', '土', '日'].map((day, idx) => {
                        // Very rough logic just to show the user's selected day as active visually 
                        // In a real app we'd map this properly to the dates of the week
                        const isSelectedVisually = (currentDateObj.getDay() || 7) === idx + 1;
                        return (
                            <div key={idx} className="day-col">
                                <span className="day-name">{day}</span>
                                <div className={`day-number ${isSelectedVisually ? 'active' : ''}`}>
                                    {/* Offset day number based on selected date */}
                                    {currentDateObj.getDate() - ((currentDateObj.getDay() || 7) - (idx + 1))}
                                </div>
                            </div>
                        );
                    })}
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
                                <div
                                    className={`timeline-card ${event.category === 'work' ? 'border-accent-left' : ''}`}
                                    onClick={() => setEditingEvent(event)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-top">
                                        <span className={`event-time ${event.category === 'work' ? 'text-accent' : 'text-muted'}`}>
                                            {event.startTime} - {event.endTime}
                                        </span>
                                        <button
                                            className="event-more"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingEvent(event);
                                            }}
                                            style={{ background: 'none', border: 'none', padding: '0 8px', cursor: 'pointer' }}
                                        >
                                            ...
                                        </button>
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
                        <textarea
                            className="memo-textarea text-main"
                            value={memoText}
                            onChange={(e) => setMemoText(e.target.value)}
                            placeholder="今日はどんな一日でしたか？気づきや反省を記録しましょう..."
                            rows={3}
                            style={{ width: '100%', background: 'transparent', border: 'none', resize: 'none', outline: 'none' }}
                        />
                        <div className="memo-actions">
                            <button
                                className={`memo-circle-btn ${isRecording ? 'bg-accent' : 'bg-dark'}`}
                                onClick={toggleRecording}
                                style={{ transition: 'background-color 0.2s' }}
                            >
                                <Mic size={18} className={isRecording ? 'pulse-anim' : ''} />
                            </button>
                            <button
                                className="memo-square-btn bg-accent"
                                onClick={handleSendMemo}
                            >
                                <Send size={18} color="#fff" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EditEventModal
                isOpen={editingEvent !== null}
                onClose={() => setEditingEvent(null)}
                eventToEdit={editingEvent}
            />
        </div>
    );
};
