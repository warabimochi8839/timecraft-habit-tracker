import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import './AddModal.css'; // Reuse existing modal styles

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
    const { clearAllData } = useApp();
    const [isConfirmingReset, setIsConfirmingReset] = useState(false);
    const [username, setUsername] = useState(() => localStorage.getItem('timecraft-username') || 'ゲストユーザー');

    if (!isOpen) return null;

    const handleSaveProfile = () => {
        localStorage.setItem('timecraft-username', username);
        toast.success('プロフィールを更新しました');
        onClose();
    };

    const handleResetData = () => {
        clearAllData();
        toast.success('全てのデータを初期化しました');
        setIsConfirmingReset(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <h3>アカウント設定</h3>
                    <div style={{ width: 24 }}></div> {/* Balance spacer */}
                </div>

                <div className="modal-body pb-8">
                    {/* Profile Section */}
                    <div className="form-group mt-4">
                        <label>プロフィール</label>
                        <div className="flex-align mb-2" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-main)' }}>
                                <User size={40} className="text-accent" />
                            </div>
                        </div>
                        <label>ユーザー名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-input"
                            placeholder="名前を入力"
                        />
                        <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleSaveProfile}>
                            プロフィールを保存
                        </button>
                    </div>

                    <div className="divider" style={{ margin: '32px 0 24px 0', background: 'var(--border-dark)', height: 1 }}></div>

                    {/* Danger Zone */}
                    <div className="form-group">
                        <label className="text-red flex-align"><ShieldAlert size={16} className="mr-2" /> 危険な操作</label>
                        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
                            この操作を行うと、これまで記録したすべてのタイムライン、目標設定、および分析データが完全に削除されます。元に戻すことはできません。
                        </p>

                        {isConfirmingReset ? (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <p className="text-red f-bold" style={{ marginBottom: '16px', textAlign: 'center' }}>本当に全てのデータを削除しますか？</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setIsConfirmingReset(false)}
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        className="btn-danger flex-align justify-center"
                                        onClick={handleResetData}
                                    >
                                        削除する
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="btn-danger btn-outline flex-align justify-center"
                                onClick={() => setIsConfirmingReset(true)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}
                            >
                                <Trash2 size={18} className="mr-2" /> データをすべて初期化する
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
