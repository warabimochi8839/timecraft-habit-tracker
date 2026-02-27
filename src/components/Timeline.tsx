import { ChevronLeft, ChevronRight, Calendar, Sun, Briefcase, Laptop, Coffee, Mic, Send, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, addDays, subDays } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { EditEventModal } from './EditEventModal';
import { CalendarModal } from './CalendarModal';
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
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const todaysEvents = state.events
        .filter(ev => ev.date === state.selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const currentDateObj = new Date(state.selectedDate);
    const formattedMonth = format(currentDateObj, 'yyyy年MM月');

    const handlePrevDay = () => setSelectedDate(format(subDays(currentDateObj, 1), 'yyyy-MM-dd'));
    const handleNextDay = () => setSelectedDate(format(addDays(currentDateObj, 1), 'yyyy-MM-dd'));

    // Generate 7 days for the date navigator (start from current date's Monday, or just center around current date)
    // Let's create a sliding window: 3 days before, current day, 3 days after
    const visibleDays = Array.from({ length: 7 }).map((_, i) => subDays(currentDateObj, 3 - i));

    // Setup Speech Recognition
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'ja-JP';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setMemoText(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
                toast.error(`音声認識エラー: ${event.error}`);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
                toast.success('音声入力を完了しました');
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (recognitionRef.current) {
                setMemoText(''); // Optional: clear or keep appending
                recognitionRef.current.start();
                setIsRecording(true);
                toast('音声入力を待機中...', { icon: <Mic size={16} className="text-accent" /> });
            } else {
                toast.error('このブラウザは音声認識に対応していません');
            }
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
                <button className="icon-button" onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="page-title">今日の振り返り</h2>
                <button className="icon-button" onClick={() => setIsCalendarOpen(true)}>
                    <Calendar size={24} />
                </button>
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
                    {visibleDays.map((dayObj, idx) => {
                        const isSelected = format(dayObj, 'yyyy-MM-dd') === state.selectedDate;
                        const dayName = ['日', '月', '火', '水', '木', '金', '土'][dayObj.getDay()];

                        return (
                            <div
                                key={idx}
                                className="day-col"
                                onClick={() => setSelectedDate(format(dayObj, 'yyyy-MM-dd'))}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className={`day-name ${isSelected ? 'text-accent' : ''}`}>{dayName}</span>
                                <div className={`day-number ${isSelected ? 'active' : ''}`}>
                                    {dayObj.getDate()}
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

            {editingEvent && (
                <EditEventModal
                    isOpen={true}
                    onClose={() => setEditingEvent(null)}
                    eventToEdit={editingEvent}
                />
            )}

            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
            />
        </div>
    );
};
