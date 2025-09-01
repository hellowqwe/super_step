export default function TaskToolbar({ onSplit, onAINotes, onAdd, onRemove, hasContent = false }) {
  const handleSplit = () => {
    if (hasContent && onSplit) {
      onSplit();
    }
  };

  const handleSplitMouseDown = () => {
    handleSplit();
  };

  const handleAINotes = () => {
    if (hasContent && onAINotes) {
      onAINotes();
    }
  };

  const handleAINotesMouseDown = () => {
    handleAINotes();
  };

  const handleAdd = () => {
    if (hasContent && onAdd) {
      onAdd();
    }
  };

  const handleAddMouseDown = () => {
    handleAdd();
  };

  const handleRemove = () => {
    console.log('🔥 TaskToolbar handleRemove called');
    console.log('🔥 hasContent:', hasContent, 'onRemove available:', !!onRemove);
    // Remove button should always work regardless of content
    if (onRemove) {
      console.log('🔥 Calling onRemove function');
      onRemove();
    } else {
      console.log('❌ onRemove function not available');
    }
  };

  return (
    <div className="task-toolbar pointer-events-auto flex items-stretch bg-[#1d2430]/95 backdrop-blur-sm rounded-md overflow-hidden shadow-[0_3px_12px_-2px_rgba(0,0,0,0.55)] ring-1 ring-gray-700/70 w-max text-[13px] leading-none">
      <button
        type="button"
        onClick={handleSplit}
        onMouseDown={handleSplitMouseDown}
        className={`px-4 py-1.5 flex items-center gap-1.5 transition-colors pointer-events-auto relative z-10 ${
          hasContent 
            ? 'text-gray-200 hover:bg-gray-700/60 active:bg-gray-600/60 cursor-pointer' 
            : 'text-gray-500 cursor-pointer'
        }`}
        style={{ pointerEvents: 'auto' }}
      >
        <svg className={`h-3.5 w-3.5 ${hasContent ? 'text-purple-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="pt-px">Split</span>
      </button>
      <div className="w-px bg-gray-700/60" />
      <button
        type="button"
        onClick={handleAINotes}
        onMouseDown={handleAINotesMouseDown}
        className={`px-4 py-1.5 flex items-center gap-1.5 transition-colors ${
          hasContent 
            ? 'text-gray-200 hover:bg-gray-700/60 active:bg-gray-600/60 cursor-pointer' 
            : 'text-gray-500 cursor-pointer'
        }`}
      >
        <svg
          className={`h-4 w-4 ${hasContent ? 'text-purple-400' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21l1.9-5.7c.1-.3.26-.56.46-.77L14.9 5.9a2.4 2.4 0 013.4 0l.8.8a2.4 2.4 0 010 3.4L9.5 19.4c-.21.2-.47.36-.77.46L3 21z" />
          <path d="M12.75 8.25l3 3" />
        </svg>
        <span className="pt-px">AI Notes</span>
      </button>
      <div className="w-px bg-gray-700/60" />
      <button
        type="button"
        onClick={handleAdd}
        onMouseDown={handleAddMouseDown}
        className={`px-5 py-1.5 font-medium text-sm transition-colors ${
          hasContent 
            ? 'text-gray-200 hover:bg-gray-700/60 active:bg-gray-600/60 cursor-pointer' 
            : 'text-gray-500 cursor-pointer'
        }`}
      >
        +
      </button>
      <div className="w-px bg-gray-700/60" />
      <button
        type="button"
        onClick={handleRemove}
        onMouseDown={(e) => {
          console.log('🔥 Remove button mousedown event');
          e.preventDefault();
          handleRemove();
        }}
        className="px-5 py-1.5 text-gray-200 hover:bg-gray-700/60 active:bg-gray-600/60 transition-colors font-medium text-sm cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        -
      </button>
    </div>
  );
}
