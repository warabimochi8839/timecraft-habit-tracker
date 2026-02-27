import React from 'react';
import { X, ArrowUpDown, EyeOff, CheckCircle2 } from 'lucide-react';
import './AddModal.css';

interface HabitSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HabitSettingsModal: React.FC<HabitSettingsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="icon-button" onClick={onClose}><X size={24} /></button>
                    <h3>目標の表示設定</h3>
                    <div style={{ width: 24 }}></div>
                </div>

                <div className="modal-body pb-8 mt-4">
                    <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                        ※ここは表示や並び順などの詳細な設定画面です。（現在はUIデモ版）
                    </p>

                    <div className="form-group mb-6">
                        <label className="form-label flex-align">
                            <ArrowUpDown size={16} className="mr-2 text-accent" /> 並び順
                        </label>
                        <select className="form-input" defaultValue="custom">
                            <option value="custom">カスタム（手動並び替え）</option>
                            <option value="category">カテゴリー順</option>
                            <option value="progress">進捗率が高い順</option>
                            <option value="streak">連続記録が長い順</option>
                        </select>
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label flex-align">
                            <EyeOff size={16} className="mr-2 text-accent" /> 表示フィルター
                        </label>

                        <label className="flex-align justify-between p-3 rounded-xl bg-dark border-subtle mb-2">
                            <span>達成済みの目標を隠す</span>
                            <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                        </label>

                        <label className="flex-align justify-between p-3 rounded-xl bg-dark border-subtle">
                            <span>0分の目標を隠す</span>
                            <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                        </label>
                    </div>

                    <button className="btn-primary w-full mt-4" onClick={onClose}>
                        <CheckCircle2 size={20} className="mr-2" />
                        設定を完了する
                    </button>
                </div>
            </div>
        </div>
    );
};
