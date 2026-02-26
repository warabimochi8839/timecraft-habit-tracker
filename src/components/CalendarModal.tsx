import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO } from 'date-fns';
import './AddModal.css'; // Reusing modal layout styles

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
    const { state, setSelectedDate } = useApp();
    const [viewDate, setViewDate] = useState(parseISO(state.selectedDate));

    if (!isOpen) return null;

    const currentMonthStart = startOfMonth(viewDate);
    const currentMonthEnd = endOfMonth(viewDate);
    const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

    // 0 = Sunday, 1 = Monday...
    const startDayOfWeek = getDay(currentMonthStart);
    // Adjust if we want week to start on Monday, but CSS grid is easy enough starting on Sunday
    const emptyDaysRegex = Array.from({ length: startDayOfWeek }).map((_, i) => i);

    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

    const handleSelectDate = (date: Date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="icon-button" onClick={onClose}><X size={24} /></button>
                    <h3>カレンダー</h3>
                    <div style={{ width: 24 }}></div>
                </div>

                <div className="modal-body pb-8 mt-4">
                    <div className="flex-align justify-between mb-4">
                        <button className="icon-button" onClick={handlePrevMonth}><ChevronLeft size={24} /></button>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{format(viewDate, 'yyyy年 M月')}</h4>
                        <button className="icon-button" onClick={handleNextMonth}><ChevronRight size={24} /></button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }}>
                        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                            <div key={day} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{day}</div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {emptyDaysRegex.map(i => <div key={`empty-${i}`} />)}
                        {daysInMonth.map(day => {
                            const isSelected = isSameDay(day, parseISO(state.selectedDate));
                            const isToday = isSameDay(day, new Date());

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => handleSelectDate(day)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: isSelected ? 'var(--accent-main)' : isToday ? 'var(--bg-card)' : 'transparent',
                                        color: isSelected ? '#fff' : 'var(--text-main)',
                                        fontWeight: isSelected || isToday ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
