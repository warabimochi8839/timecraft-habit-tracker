import React from 'react';
import { ChevronLeft, Settings, Flame, GraduationCap, Moon, BookOpen, Dumbbell, Check, Plus } from 'lucide-react';
import './Habits.css';

export const Habits: React.FC = () => {
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
                        <span className="streak-big-number">5</span>
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
                        <span>3/5 完了</span>
                    </div>
                </div>

                {/* Goals List */}
                <div className="goals-list">

                    {/* Goal 1: Study */}
                    <div className="goal-card">
                        <div className="goal-card-top">
                            <div className="goal-icon-box bg-blue-subtle">
                                <GraduationCap size={20} className="text-blue" />
                            </div>
                            <div className="goal-info">
                                <h4>勉強</h4>
                                <span className="goal-desc">英語のリスニング練習</span>
                            </div>
                            <div className="goal-stats">
                                <span className="stat-current text-blue">3</span>
                                <span className="stat-total"> / 4 時間</span>
                            </div>
                        </div>
                        <div className="goal-progress-track">
                            <div className="goal-progress-fill bg-blue" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    {/* Goal 2: Sleep (Completed) */}
                    <div className="goal-card border-glow">
                        <div className="goal-card-top">
                            <div className="goal-icon-box bg-blue-solid">
                                <Moon size={20} color="#fff" fill="#fff" />
                            </div>
                            <div className="goal-info">
                                <h4>睡眠</h4>
                                <span className="goal-desc">7時間以上の睡眠を確保</span>
                            </div>
                            <div className="goal-stats flex-align">
                                <span className="stat-current text-blue f-bold">完了</span>
                                <div className="check-circle">
                                    <Check size={14} color="#3b82f6" />
                                </div>
                            </div>
                        </div>
                        <div className="goal-progress-track">
                            <div className="goal-progress-fill bg-blue" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Goal 3: Reading */}
                    <div className="goal-card">
                        <div className="goal-card-top">
                            <div className="goal-icon-box bg-purple-subtle">
                                <BookOpen size={20} className="text-purple" />
                            </div>
                            <div className="goal-info">
                                <h4>読書</h4>
                                <span className="goal-desc">ビジネス書の要約を読む</span>
                            </div>
                            <div className="goal-stats">
                                <span className="stat-current text-purple">10</span>
                                <span className="stat-total"> / 30 分</span>
                            </div>
                        </div>
                        <div className="goal-progress-track">
                            <div className="goal-progress-fill bg-purple" style={{ width: '33%' }}></div>
                        </div>
                    </div>

                    {/* Goal 4: Exercise (Disabled/Empty) */}
                    <div className="goal-card disabled-card">
                        <div className="goal-card-top">
                            <div className="goal-icon-box bg-dark">
                                <Dumbbell size={20} className="text-muted" />
                            </div>
                            <div className="goal-info">
                                <h4>運動</h4>
                                <span className="goal-desc">ジムまたはランニング</span>
                            </div>
                            <div className="goal-stats">
                                <span className="stat-current text-muted">0</span>
                                <span className="stat-total"> / 45 分</span>
                            </div>
                        </div>
                        <div className="goal-progress-track bg-darker">
                            <div className="goal-progress-fill" style={{ width: '0%' }}></div>
                        </div>
                    </div>

                </div>

                {/* Add Button */}
                <button className="add-goal-btn">
                    <Plus size={18} className="text-muted" />
                    <span>新しい目標を追加</span>
                </button>

            </div>
        </div>
    );
};
