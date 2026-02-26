import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Habit } from '../types';
import { toast } from 'sonner';
import './AddModal.css';

interface EditHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitToEdit: Habit | null;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({ isOpen, onClose, habitToEdit }) => {
    const { updateHabit, deleteHabit } = useApp();

    const [habitTitle, setHabitTitle] = useState('');
    const [habitCategory, setHabitCategory] = useState<'work' | 'study' | 'sleep' | 'free'>('study');
    const [habitTargetMins, setHabitTargetMins] = useState(30);

    useEffect(() => {
        if (habitToEdit) {
            setHabitTitle(habitToEdit.title);
            setHabitCategory(habitToEdit.category);
            setHabitTargetMins(habitToEdit.targetTimeMinutes);
        }
    }, [habitToEdit]);

    if (!isOpen || !habitToEdit) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!habitTitle.trim()) return;

        updateHabit(habitToEdit.id, {
            title: habitTitle,
            category: habitCategory,
            targetTimeMinutes: Number(habitTargetMins)
        });

        toast.success('目標を更新しました');
        onClose();
    };

    const handleDelete = () => {
        if (confirm('この目標を削除してもよろしいですか？記録も失われます。')) {
            deleteHabit(habitToEdit.id);
            toast.success('目標を削除しました');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>目標の編集</h2>
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
                                value={habitTitle}
                                onChange={e => setHabitTitle(e.target.value)}
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

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button type="button" onClick={handleDelete} className="submit-btn" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--danger, #ef4444)', color: 'var(--danger, #ef4444)' }}>
                                <Trash2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                削除
                            </button>
                            <button type="submit" className="submit-btn bg-purple" style={{ flex: 2 }}>保存する</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
