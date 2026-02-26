import { ChevronLeft, Settings, Flame, GraduationCap, Moon, BookOpen, Dumbbell, Check, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { AddModal } from './AddModal';
import { toast } from 'sonner';
import './Habits.css';

const getHabitIcon = (category: string) => {
    switch (category) {
        case 'study': return <GraduationCap size={20} className="text-blue" />;
        case 'sleep': return <Moon size={20} color="#fff" fill="#fff" />;
        case 'free': return <BookOpen size={20} className="text-purple" />;
        default: return <Dumbbell size={20} className="text-muted" />;
    }
};

const getHabitColorClass = (category: string, isCompleted: boolean) => {
    if (isCompleted) {
        if (category === 'study') return 'bg-blue-solid';
        if (category === 'sleep') return 'bg-blue-solid';
        if (category === 'free') return 'bg-purple-solid';
        return 'bg-dark';
    }
    switch (category) {
        case 'study': return 'bg-blue-subtle';
        case 'sleep': return 'bg-blue-subtle';
        case 'free': return 'bg-purple-subtle';
        default: return 'bg-dark';
    }
};

const getProgressBarColor = (category: string) => {
    switch (category) {
        case 'study': return 'bg-blue';
        case 'sleep': return 'bg-blue';
        case 'free': return 'bg-purple';
        default: return 'bg-muted';
    }
};

export const Habits: React.FC = () => {
    const { state, toggleHabitCompletion } = useApp();
    const today = state.selectedDate;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Derived state
    const completedCount = state.habits.filter(h => h.completedDates.includes(today)).length;
    const totalCount = state.habits.length;
    // For the UI, we just find the max streak from habits
    const maxStreak = Math.max(...state.habits.map(h => h.currentStreak), 0);
    return (
        <div className="habits-page">
            {/* Header */}
            <header className="page-header">
                <button className="icon-button"><ChevronLeft size={24} /></button>
                <h2 className="page-title">目標設定</h2>
                <button className="icon-button"><Settings size={24} /></button>
            </header>

            <div className="habits-scroll-area">
                {/* Streak Hero Card */}
                <div className="streak-hero-card">
                    <div className="streak-bg-flame"><Flame size={120} /></div>
                    <span className="streak-label">現在のストリーク</span>
                    <div className="streak-value-container">
                        <Flame size={32} className="text-orange" fill="#f59e0b" />
                        <span className="streak-big-number">{maxStreak || 0}</span>
                        <span className="streak-text">日連続達成！</span>
                    </div>
                    <div className="streak-progress-bar">
                        <div className="streak-progress-fill" style={{ width: '70%' }}></div>
                    </div>
                    <span className="streak-message">素晴らしい調子です！このまま続けましょう。</span>
                </div>

                {/* Section Header */}
                <div className="section-header">
                    <div className="section-title-wrapper">
                        <div className="section-indicator"></div>
                        <h3>今日の目標</h3>
                    </div>
                    <div className="status-pill">
                        <span>{completedCount}/{totalCount} 完了</span>
                    </div>
                </div>

                {/* Goals List */}
                <div className="goals-list">
                    {state.habits.map(habit => {
                        const isCompleted = habit.completedDates.includes(today);

                        // Just an arbitrary mock progress for uncompleted tasks (e.g. 50%) for visual parity with screenshot
                        // Realistically this would be driven by time-tracking tie-in later
                        const progressPct = isCompleted ? 100 : 33;

                        return (
                            <div
                                key={habit.id}
                                className={`goal-card ${isCompleted ? 'border-glow' : ''} ${habit.targetTimeMinutes === 0 ? 'disabled-card' : ''}`}
                                onClick={() => toggleHabitCompletion(habit.id, today)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="goal-card-top">
                                    <div className={`goal-icon-box ${getHabitColorClass(habit.category, isCompleted)}`}>
                                        {isCompleted && (habit.category === 'sleep' || habit.category === 'study') ? (
                                            <Moon size={20} color="#fff" fill="#fff" /> /* Force moon icon logic from screenshot mock */
                                        ) : getHabitIcon(habit.category)}
                                    </div>
                                    <div className="goal-info">
                                        <h4>{habit.title}</h4>
                                        <span className="goal-desc">{habit.category === 'sleep' ? '十分な睡眠を確保' : '目標を達成する'}</span>
                                    </div>

                                    <div className="goal-card-actions" style={{ marginLeft: 'auto' }}>
                                        <button
                                            className="icon-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info(`「${habit.title}」の編集・削除は準備中です`);
                                            }}
                                            style={{ padding: '4px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                                            aria-label="オプション"
                                        >
                                            <Settings size={16} />
                                        </button>
                                    </div>

                                    {isCompleted ? (
                                        <div className="goal-stats flex-align">
                                            <span className="stat-current text-blue f-bold">完了</span>
                                            <div className="check-circle">
                                                <Check size={14} color="#3b82f6" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="goal-stats">
                                            <span className={`stat-current ${habit.category === 'study' || habit.category === 'sleep' ? 'text-blue' : 'text-purple'}`}>
                                                {progressPct === 100 ? habit.targetTimeMinutes : Math.floor(habit.targetTimeMinutes * (progressPct / 100))}
                                            </span>
                                            <span className="stat-total"> / {habit.targetTimeMinutes} 分</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`goal-progress-track ${habit.targetTimeMinutes === 0 ? 'bg-darker' : ''}`}>
                                    <div className={`goal-progress-fill ${getProgressBarColor(habit.category)}`} style={{ width: `${progressPct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Button */}
                <button className="add-goal-btn" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} className="text-muted" />
                    <span>新しい目標を追加</span>
                </button>

            </div>

            <AddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialTab="habit"
            />
        </div>
    );
};
