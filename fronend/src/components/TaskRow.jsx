import { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskToolbar from './TaskToolbar';

export default function TaskRow({ 
  task, 
  depth = 0, 
  activeTaskId,
  onUpdate, 
  onAddChild, 
  onSplit, 
  onRemove,
  onActivate,
  onDeactivate,
  onAINotes
}) {
  const [hasTyped, setHasTyped] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

  // Update hasTyped when task title changes
  useEffect(() => {
    setHasTyped(!!task.title && task.title.trim().length > 0);
  }, [task.title]);

  // Reset click position when task becomes inactive
  useEffect(() => {
    if (activeTaskId !== task.id) {
      setClickPosition(null);
    }
  }, [activeTaskId, task.id]);

  const handleDraftChange = (value) => {
    // Update the task title directly for real-time changes
    onUpdate(task.id, { title: value });
    setHasTyped(value.trim().length > 0); // Enable buttons when there's content
  };

  const handleCommit = () => {
    // Just deactivate since we're updating in real-time
    onUpdate(task.id, { isEditing: false });
    onDeactivate(task.id);
  };

  const handleCancel = () => {
    // No need to reset draft since we're not using it
    onUpdate(task.id, { isEditing: false });
    onDeactivate(task.id);
  };

  const handleActivate = (cursorPos = null) => {
    setClickPosition(cursorPos);
    onActivate(task.id);
  };

  const handleToggleComplete = () => {
    const newCompletedState = !task.completed;
    
    // Update this task
    onUpdate(task.id, { completed: newCompletedState });
    
    // Recursively update all children to match parent's state
    const updateChildrenRecursively = (children) => {
      children.forEach(child => {
        onUpdate(child.id, { completed: newCompletedState });
        if (child.children && child.children.length > 0) {
          updateChildrenRecursively(child.children);
        }
      });
    };
    
    if (task.children && task.children.length > 0) {
      updateChildrenRecursively(task.children);
    }
  };

  const handleSplit = () => {
    // No need to save draft since we're updating in real-time
    onSplit(task.id);
  };

  const handleAINotes = async () => {
    // No need to save draft since we're updating in real-time
    console.log('🤖 Generating AI notes for task:', task.id);
    
    if (onAINotes) {
      onAINotes(task.id);
    }
  };

  const handleAddChild = () => {
    // No need to save draft since we're updating in real-time
    onAddChild(task.id);
  };

  const handleRemove = () => {
    console.log('🔴 handleRemove called for task:', task.id, 'title:', task.title);
    console.log('🔴 Task has children:', task.children ? task.children.length : 0);
    if (task.children && task.children.length > 0) {
      console.log('🔴 Children:', task.children.map(c => `${c.id}: ${c.title}`));
    }
    onRemove(task.id);
  };

  const indentStyle = { paddingLeft: depth * 24 };

  return (
    <div className="task-row-container w-full">
      <div 
        className="group relative cursor-pointer w-full"
        style={indentStyle}
        onClick={(e) => {
          // Only activate if clicking on the row itself, not on buttons or checkbox
          if (e.target === e.currentTarget || e.target.closest('.task-input-container')) {
            if (activeTaskId !== task.id) {
              handleActivate(null); // null means position at end
            }
          }
        }}
      >
        {/* Hover background - extends to full width */}
        <div className="row-hover-background absolute inset-0 -left-1 right-0 rounded-lg bg-transparent group-hover:bg-gradient-to-r group-hover:from-purple-900/20 group-hover:to-purple-800/10 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300 ease-in-out -z-10" />
        
        <div className="content-row flex items-center relative z-10 w-full">
          {/* Checkbox */}
          <div className="checkbox-container mr-3 flex-shrink-0">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-gray-600 transition-all duration-200 checked:border-purple-600 checked:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 group-hover:border-gray-400 group-hover:shadow-md"
                checked={task.completed}
                onChange={handleToggleComplete}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-white"
                  style={{
                    opacity: task.completed ? 1 : 0,
                    transform: task.completed ? 'scale(1)' : 'scale(0.8)',
                    transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out'
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    style={{
                      strokeDasharray: task.completed ? '20' : '0',
                      strokeDashoffset: task.completed ? '0' : '20',
                      transition: 'stroke-dasharray 0.3s ease-in-out, stroke-dashoffset 0.3s ease-in-out'
                    }}
                  />
                </svg>
              </div>
            </label>
          </div>

          {/* Input area */}
          <div className="flex-1 relative min-w-0 task-input-container w-full">
            <div className="relative w-full">
              {/* Toolbar - positioned absolutely to not affect text layout */}
              {activeTaskId === task.id && (
                <div className="absolute -top-8 left-0 z-50">
                  <TaskToolbar
                    onSplit={handleSplit}
                    onAINotes={handleAINotes}
                    onAdd={handleAddChild}
                    onRemove={handleRemove}
                    hasContent={hasTyped}
                  />
                </div>
              )}
              
              {/* Input field - consistent positioning */}
              <div className="relative">
                <TaskInput
                  value={task.title || ''}
                  onChange={handleDraftChange}
                  onCommit={handleCommit}
                  onCancel={handleCancel}
                  isActive={activeTaskId === task.id}
                  onActivate={handleActivate}
                  placeholder={depth > 0 ? "Enter Subtask" : "Add task..."}
                  clickPosition={clickPosition}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {task.children && task.children.length > 0 && (
        <div className="children-container">
          {task.children.map((childTask) => (
            <TaskRow
              key={childTask.id}
              task={childTask}
              depth={depth + 1}
              activeTaskId={activeTaskId}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
              onSplit={onSplit}
              onRemove={onRemove}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              onAINotes={onAINotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
