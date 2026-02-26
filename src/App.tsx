import { useState } from 'react';
import { PieChart, User, Plus, Flag, LayoutDashboard } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { Habits } from './components/Habits';
import { Summary } from './components/Summary';
import { AddModal } from './components/AddModal';
import { AccountModal } from './components/AccountModal';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'habits' | 'summary'>('timeline');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="app-main no-scrollbar">
        {activeTab === 'timeline' && (
          <div className="tab-content transition-fade">
            <Timeline />
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="tab-content transition-fade">
            <Habits
              onBackClick={() => setActiveTab('timeline')}
              onSettingsClick={() => setIsAccountModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="tab-content transition-fade">
            <Summary
              onBackClick={() => setActiveTab('timeline')}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <LayoutDashboard size={22} strokeWidth={2.5} />
          <span>ﾀｲﾑﾗｲﾝ</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          <Flag size={22} strokeWidth={2.5} />
          <span>目標</span>
        </button>

        {/* Center Floating Button */}
        <div className="nav-fab-wrapper">
          <button className="nav-fab" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={28} color="#fff" strokeWidth={3} />
          </button>
        </div>

        <button
          className={`nav-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <PieChart size={22} strokeWidth={2.5} />
          <span>分析</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => setIsAccountModalOpen(true)}
        >
          <User size={22} strokeWidth={2.5} />
          <span>ｱｶｳﾝﾄ</span>
        </button>
      </nav>

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTab={activeTab === 'habits' ? 'habit' : 'event'}
      />

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

export default App;
