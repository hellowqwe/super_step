import React from 'react';

// variant: 'overlay' (default) slides over content, 'inline' is always visible at far left
const Sidebar = ({ open = true, onClose, variant = 'overlay' }) => {
  if (variant === 'inline') {
    return (
      <aside className="w-56 shrink-0 h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-xs font-semibold tracking-wider text-gray-400">MENU</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">My Tasks</button>
          <button className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Inbox</button>
          <button className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Settings</button>
        </nav>
      </aside>
    );
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <span className="text-sm font-semibold tracking-wide text-gray-300">NAVIGATION</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">My Tasks</button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Inbox</button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Settings</button>
        </nav>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
    </div>
  );
};

export default Sidebar;
