import React, { useState } from 'react';
import { X, Clock, Tag, AlignLeft, Target, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AddModal.css';

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'event' | 'habit';
}

export const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, initialTab = 'event' }) => {
    const { addEvent, addHabit, state } = useApp();
    const [activeTab, setActiveTab] = useState<'event' | 'habit'>(initialTab);

    // Form states for Event
    const [eventTitle, setEventTitle] = useState('');
    const [eventStart, setEventStart] = useState('12:00');
    const [eventEnd, setEventEnd] = useState('13:00');
    const [eventCategory, setEventCategory] = useState<'work' | 'study' | 'sleep' | 'free'>('work');
    const [eventMemo, setEventMemo] = useState('');

    // Form states for Habit
    const [habitTitle, setHabitTitle] = useState('');
    const [habitCategory, setHabitCategory] = useState<'work' | 'study' | 'sleep' | 'free'>('study');
    const [habitTargetMins, setHabitTargetMins] = useState(30);

    if (!isOpen) return null;

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventTitle.trim()) return;

        addEvent({
            title: eventTitle,
            category: eventCategory,
            startTime: eventStart,
            endTime: eventEnd,
            date: state.selectedDate,
            memo: eventMemo,
            tags: []
        });

        // Reset and close
        setEventTitle('');
        setEventMemo('');
        onClose();
    };

    const handleSaveHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!habitTitle.trim()) return;

        addHabit({
            title: habitTitle,
            category: habitCategory,
            targetTimeMinutes: Number(habitTargetMins)
        });

        // Reset and close
        setHabitTitle('');
        setHabitTargetMins(30);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>追加する</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === 'event' ? 'active' : ''}`}
                        onClick={() => setActiveTab('event')}
                    >
                        <CalendarDays size={18} />
                        予定
                    </button>
                    <button
                        className={`modal-tab ${activeTab === 'habit' ? 'active' : ''}`}
                        onClick={() => setActiveTab('habit')}
                    >
                        <Target size={18} />
                        目標・習慣
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'event' ? (
                        <form onSubmit={handleSaveEvent} className="modal-form">
                            <div className="form-group">
                                <label>タイトル</label>
                                <input
                                    type="text"
                                    value={eventTitle}
                                    onChange={e => setEventTitle(e.target.value)}
                                    placeholder="例: 会議、読書、ランニング"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label><Clock size={16} /> 開始時間</label>
                                    <input
                                        type="time"
                                        value={eventStart}
                                        onChange={e => setEventStart(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label><Clock size={16} /> 終了時間</label>
                                    <input
                                        type="time"
                                        value={eventEnd}
                                        onChange={e => setEventEnd(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Tag size={16} /> カテゴリ</label>
                                <div className="category-selector">
                                    <button type="button" className={`category-btn ${eventCategory === 'work' ? 'active-work' : ''}`} onClick={() => setEventCategory('work')}>仕事</button>
                                    <button type="button" className={`category-btn ${eventCategory === 'study' ? 'active-study' : ''}`} onClick={() => setEventCategory('study')}>学習</button>
                                    <button type="button" className={`category-btn ${eventCategory === 'free' ? 'active-free' : ''}`} onClick={() => setEventCategory('free')}>自由・その他</button>
                                    <button type="button" className={`category-btn ${eventCategory === 'sleep' ? 'active-sleep' : ''}`} onClick={() => setEventCategory('sleep')}>睡眠</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label><AlignLeft size={16} /> メモ (任意)</label>
                                <textarea
                                    value={eventMemo}
                                    onChange={e => setEventMemo(e.target.value)}
                                    placeholder="場所や気づきなど..."
                                    rows={2}
                                />
                            </div>

                            <button type="submit" className="submit-btn bg-accent">追加する</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSaveHabit} className="modal-form">
                            <div className="form-group">
                                <label>習慣・目標のタイトル</label>
                                <input
                                    type="text"
                                    value={habitTitle}
                                    onChange={e => setHabitTitle(e.target.value)}
                                    placeholder="例: 英語のリスニング、筋トレ"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><Clock size={16} /> 1日の目標時間 (分)</label>
                                <input
                                    type="number"
                                    value={habitTargetMins}
                                    onChange={e => setHabitTargetMins(parseInt(e.target.value))}
                                    min={0}
                                    step={5}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><Tag size={16} /> カテゴリ</label>
                                <div className="category-selector">
                                    <button type="button" className={`category-btn ${habitCategory === 'study' ? 'active-study' : ''}`} onClick={() => setHabitCategory('study')}>学習</button>
                                    <button type="button" className={`category-btn ${habitCategory === 'work' ? 'active-work' : ''}`} onClick={() => setHabitCategory('work')}>仕事</button>
                                    <button type="button" className={`category-btn ${habitCategory === 'free' ? 'active-free' : ''}`} onClick={() => setHabitCategory('free')}>運動・自由</button>
                                    <button type="button" className={`category-btn ${habitCategory === 'sleep' ? 'active-sleep' : ''}`} onClick={() => setHabitCategory('sleep')}>睡眠</button>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn bg-purple">目標を追加</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
