import React, { useState } from 'react';
import { Home, LayoutList, PieChart, User, Plus, Calendar, Flag, LayoutDashboard } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { Habits } from './components/Habits';
import { Summary } from './components/Summary';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'habits' | 'summary'>('timeline');

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
            <Habits />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="tab-content transition-fade">
            <Summary />
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
          <button className="nav-fab">
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
          onClick={() => { }}
        >
          <User size={22} strokeWidth={2.5} />
          <span>ｱｶｳﾝﾄ</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
