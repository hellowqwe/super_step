import './App.css';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import React from 'react';

// Acts as the top-level layout (header + routed content)
export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-root">
        <div className="app-container min-h-screen bg-black text-white flex flex-col">
          <div className="header-section">
            <Header onClearAllTasks={() => {}} />
          </div>
          <div className="main-content-wrapper flex-1">
            <div className="main-content-container w-full py-6 pl-8">
              <div className="page-outlet">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
