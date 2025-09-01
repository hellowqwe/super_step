import React, { useState } from 'react';

const TaskItem = ({ 
  task, 
  level = 0, 
  selectedTaskId, 
  onTaskSelect, 
  onTaskUpdate, 
  onOpenNotes 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInlineNotes, setShowInlineNotes] = useState(false);
  
  const handleSplit = () => {
    setLoading(true);
    // Simulate API call to split task
    setTimeout(() => {
      const newSubtasks = [
        { id: `${task.id}-1`, title: `Research phase for: ${task.title}`, completed: false },
        { id: `${task.id}-2`, title: `Planning phase for: ${task.title}`, completed: false },
        { id: `${task.id}-3`, title: `Implementation phase for: ${task.title}`, completed: false },
      ];
      
      onTaskUpdate(task.id, { subtasks: newSubtasks });
      setExpanded(true);
      setLoading(false);
    }, 1000);
  };

  const handleTaskClick = () => {
    onTaskSelect(task.id);
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onTaskUpdate(task.id, { completed: !task.completed });
  };

  const toggleExpanded = () => {
    if (task.subtasks && task.subtasks.length > 0) {
      setExpanded(!expanded);
    }
  };

  const toggleInlineNotes = () => {
    setShowInlineNotes(!showInlineNotes);
  };

  const openSideNotes = () => {
    onOpenNotes(task.id);
  };

  const isSelected = selectedTaskId === task.id;

  return (
    <div className="mb-1">
      <div 
        className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${
          isSelected ? 'bg-gray-700 border-l-2 border-purple-500' : ''
        }`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={handleTaskClick}
      >
        <div className="flex items-center flex-1">
          {task.subtasks && task.subtasks.length > 0 ? (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
              className="text-gray-400 hover:text-white mr-2"
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ) : (
            <div className="w-6"></div>
          )}
          
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={handleToggleComplete}
            className="mr-3 h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          
          <span className={`text-sm flex-1 ${
            task.completed ? 'line-through text-gray-500' : 'text-white'
          }`}>
            {task.title}
          </span>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleInlineNotes(); }}
            className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-gray-300"
          >
            Tips
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); openSideNotes(); }}
            className="text-xs px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white"
          >
            Guide
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleSplit(); }}
            className="text-xs px-2 py-1 rounded bg-purple-700 hover:bg-purple-600 text-white flex items-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Split'}
          </button>
        </div>
      </div>
      
      {showInlineNotes && (
        <div className="mt-2 mb-2 p-3 bg-gray-700 rounded-md text-sm text-gray-300 border-l-2 border-blue-500" style={{ marginLeft: `${(level + 1) * 20}px` }}>
          <h4 className="font-medium text-blue-400 mb-1">Quick Tips:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Start with the most important part first</li>
            <li>Break this down if it feels overwhelming</li>
            <li>Set a realistic timeline for completion</li>
          </ul>
        </div>
      )}
      
      {expanded && task.subtasks && (
        <div className="mt-1">
          {task.subtasks.map(subtask => (
            <TaskItem 
              key={subtask.id} 
              task={subtask} 
              level={level + 1}
              selectedTaskId={selectedTaskId}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              onOpenNotes={onOpenNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskTree = ({ 
  tasks, 
  selectedTaskId, 
  onTaskSelect, 
  onTaskUpdate, 
  onOpenNotes 
}) => {
  return (
    <div className="w-full space-y-1">
      {tasks.map(task => (
        <div key={task.id} className="group">
          <TaskItem 
            task={task} 
            selectedTaskId={selectedTaskId}
            onTaskSelect={onTaskSelect}
            onTaskUpdate={onTaskUpdate}
            onOpenNotes={onOpenNotes}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskTree;