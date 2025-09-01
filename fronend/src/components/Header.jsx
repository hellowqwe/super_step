import React, { useState } from 'react';

const Header = ({ onClearAllTasks }) => {
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark(d => !d);
  return (
    <div className="header-wrapper">
      <header className="header-content flex items-center justify-between px-5 py-4 bg-black border-none border-gray-800/40">
        <div className="header-left flex items-center">
          <div className="menu-button-container mr-4">
            <button
              type="button"
              className="menu-button flex items-center justify-center h-10 w-10 rounded-xl border border-gray-700/70 hover:border-gray-500/70 transition-colors"
              title="Sidebar menu"
            >
              <div className="menu-icon-wrapper space-y-1.5">
                <span className="menu-line block h-0.5 w-6 bg-gray-200 rounded" />
                <span className="menu-line block h-0.5 w-6 bg-gray-200 rounded" />
                <span className="menu-line block h-0.5 w-6 bg-gray-200 rounded" />
              </div>
            </button>
          </div>
          <div className="logo-container text-purple-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="logo-icon h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="app-title-container">
            <h1 className="app-title text-white text-2xl font-bold tracking-tight">StepWise</h1>
          </div>
        </div>
        <div className="header-right flex items-center space-x-6">
          <div className="delete-button-container">
            <button
              onClick={onClearAllTasks}
              className="delete-button text-gray-400 hover:text-red-400 transition-colors"
              title="Clear all tasks"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="delete-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <div className="dark-mode-button-container">
            <button
              onClick={toggleDark}
              className="dark-mode-button text-gray-400 hover:text-white transition-colors"
              title="Toggle dark mode"
            >
              <div className="dark-mode-icon">
                {dark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="sun-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="moon-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </div>
            </button>
          </div>
          <div className="settings-button-container">
            <button className="settings-button text-gray-400 hover:text-white transition-colors" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="settings-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;