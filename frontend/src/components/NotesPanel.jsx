import React from 'react';

const NotesPanel = ({ isOpen, onClose, notes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-gray-900 h-full overflow-y-auto shadow-lg">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">AI Notes</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {notes ? (
            <div className="text-gray-300">
              <h3 className="text-lg font-medium text-purple-400 mb-3">{notes.title}</h3>
              <div className="space-y-4">
                {notes.sections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-white font-medium mb-2">{section.heading}</h4>
                    <p className="text-gray-400 mb-2">{section.description}</p>
                    {section.items && (
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        {section.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-500">Select a task and click "AI Notes" to view guidance</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;