import { useState, useEffect, useRef } from 'react';

export default function TaskInput({ 
  value, 
  onChange, 
  onCommit, 
  onCancel, 
  placeholder = "Enter Task",
  isActive = false,
  onActivate,
  clickPosition = null
}) {
  const [underlineActive, setUnderlineActive] = useState(false);
  const textareaRef = useRef(null);
  const [initialCursorSet, setInitialCursorSet] = useState(false);

  // Trigger underline animation when input becomes active
  useEffect(() => {
    if (isActive) {
      // Small delay to ensure smooth transition
      requestAnimationFrame(() => {
        setTimeout(() => setUnderlineActive(true), 50);
      });
      
      // Set cursor position only once when becoming active
      if (textareaRef.current && !initialCursorSet) {
        setTimeout(() => {
          textareaRef.current.focus();
          if (clickPosition !== null) {
            // Position cursor at clicked location
            textareaRef.current.setSelectionRange(clickPosition, clickPosition);
          } else {
            // Position cursor at end of text
            const textLength = (value || '').length;
            textareaRef.current.setSelectionRange(textLength, textLength);
          }
          setInitialCursorSet(true);
        }, 100);
      }
    } else {
      // Immediate hide to prevent visual glitch
      setUnderlineActive(false);
      setInitialCursorSet(false); // Reset for next activation
    }
  }, [isActive, clickPosition, initialCursorSet, value]);

  // Function to calculate cursor position from click coordinates
  const getCursorPositionFromClick = (clickEvent, text) => {
    const element = clickEvent.target;
    const rect = element.getBoundingClientRect();
    const x = clickEvent.clientX - rect.left;
    
    // Create a temporary canvas to measure text width
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Get computed styles to match the text rendering
    const computedStyle = window.getComputedStyle(element);
    context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    
    let position = 0;
    
    // Find the character position closest to the click
    for (let i = 0; i <= text.length; i++) {
      const textWidth = context.measureText(text.substring(0, i)).width;
      if (textWidth > x) {
        // Check if we're closer to the current or previous position
        const prevWidth = i > 0 ? context.measureText(text.substring(0, i - 1)).width : 0;
        position = (x - prevWidth) < (textWidth - x) ? i - 1 : i;
        break;
      }
      position = i;
    }
    
    return Math.max(0, Math.min(position, text.length));
  };

  if (!isActive) {
    return (
      <div className="relative">
        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent bubbling to parent row
            const textToMeasure = value || '';  // Use actual text, not placeholder
            const cursorPos = getCursorPositionFromClick(e, textToMeasure);
            onActivate(cursorPos);
          }}
          className={`text-sm cursor-pointer transition-all duration-200 py-2 w-full block min-w-0 min-h-[32px] leading-relaxed ${
            value && value.trim() 
              ? 'text-white' // Same color as active textarea
              : 'text-gray-400 group-hover:text-gray-300' // Same placeholder color as active textarea
          }`}
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        >
          {value || placeholder}
        </div>
        {/* Invisible underline container to maintain consistent spacing */}
        <div
          className="absolute left-0 bottom-0 h-px overflow-hidden"
          style={{ height: '1px', width: '85%' }}
        >
          <div
            className="h-full bg-transparent transform scale-x-0"
            style={{ height: '1px' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onCommit();
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        placeholder={placeholder}
        className="resize-none bg-transparent w-full min-w-0 text-sm placeholder-gray-400 focus:placeholder-gray-300 outline-none text-white py-2 leading-relaxed overflow-hidden block"
        autoFocus
        style={{
          minHeight: '32px',
          maxHeight: '200px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      />
      <div
        className="absolute left-0 bottom-0 h-px overflow-hidden"
        style={{ height: '1px', width: '85%' }}
      >
        <div
          className={`h-full bg-white origin-center transform transition-transform duration-300 ease-out ${underlineActive ? 'scale-x-100' : 'scale-x-0'}`}
          style={{ 
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            height: '1px'
          }}
        />
      </div>
    </div>
  );
}
