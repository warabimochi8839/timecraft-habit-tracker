import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, AlignLeft, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TimelineEvent } from '../types';
import { toast } from 'sonner';
import './AddModal.css';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventToEdit: TimelineEvent | null;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, eventToEdit }) => {
    const { state, updateEvent, deleteEvent } = useApp();

    const [eventTitle, setEventTitle] = useState('');
    const [eventStart, setEventStart] = useState('12:00');
    const [eventEnd, setEventEnd] = useState('13:00');
    const [eventCategory, setEventCategory] = useState<'work' | 'study' | 'sleep' | 'free'>('work');
    const [eventMemo, setEventMemo] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setEventTitle(eventToEdit.title);
            setEventStart(eventToEdit.startTime);
            setEventEnd(eventToEdit.endTime);
            setEventCategory(eventToEdit.category);
            setEventMemo(eventToEdit.memo || '');
        }
    }, [eventToEdit]);

    if (!isOpen || !eventToEdit) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventTitle.trim()) return;

        if (eventStart >= eventEnd) {
            toast.error('開始時間は終了時間より前である必要があります。');
            return;
        }

        const hasOverlap = state.events.some(ev => {
            if (ev.date !== eventToEdit.date) return false;
            if (ev.id === eventToEdit.id) return false; // ignore self
            return eventStart < ev.endTime && eventEnd > ev.startTime;
        });

        if (hasOverlap) {
            toast.error('指定された時間は既存の予定と重複しています。');
            return;
        }

        updateEvent(eventToEdit.id, {
            title: eventTitle,
            category: eventCategory,
            startTime: eventStart,
            endTime: eventEnd,
            memo: eventMemo,
        });

        toast.success('予定を更新しました');
        onClose();
    };

    const handleDelete = () => {
        if (confirm('この予定を削除してもよろしいですか？')) {
            deleteEvent(eventToEdit.id);
            toast.success('予定を削除しました');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>予定の編集</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSave} className="modal-form">
                        <div className="form-group">
                            <label>タイトル</label>
                            <input
                                type="text"
                                value={eventTitle}
                                onChange={e => setEventTitle(e.target.value)}
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
                                rows={2}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button type="button" onClick={handleDelete} className="submit-btn" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--danger, #ef4444)', color: 'var(--danger, #ef4444)' }}>
                                <Trash2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                削除
                            </button>
                            <button type="submit" className="submit-btn bg-accent" style={{ flex: 2 }}>保存する</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
