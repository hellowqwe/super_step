import { useState, useEffect, useCallback } from 'react';
import TaskRow from '../components/TaskRow';
import apiService from '../services/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to find a task in the tree
  const findTaskInTree = (taskList, targetId) => {
    for (const task of taskList) {
      if (task.id === targetId) {
        return task;
      }
      if (task.children && task.children.length > 0) {
        const found = findTaskInTree(task.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await apiService.getTasks();
      
      // If no tasks exist, create an initial empty task
      if (tasksData.length === 0) {
        const newTask = await apiService.createTask('');
        setTasks([newTask]);
        setActiveTaskId(newTask.id);
      } else {
        setTasks(tasksData);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please check if the backend is running.');
      // Fallback: create a local task if backend is unavailable
      const fallbackTask = {
        id: Math.random().toString(36).slice(2),
        title: '',
        completed: false,
        created_at: new Date().toISOString(),
        children: []
      };
      setTasks([fallbackTask]);
      setActiveTaskId(fallbackTask.id);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a task using backend API
  const removeTask = useCallback(async (taskId) => {
    try {
      console.log('🗑️ removeTask called for taskId:', taskId);
      
      await apiService.deleteTask(taskId);
      
      // Clear active task if it was being deleted
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      
      // Reload tasks to get updated structure
      await loadTasks();
    } catch (error) {
      console.error('Failed to remove task:', error);
      setError('Failed to remove task');
    }
  }, [activeTaskId, loadTasks]);

  // Update a task using backend API
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      // Update local state with the response from backend
      const updateTaskInTree = (taskList) => {
        return taskList.map(task => {
          if (task.id === taskId) {
            return { ...task, ...updatedTask };
          }
          if (task.children && task.children.length > 0) {
            return { ...task, children: updateTaskInTree(task.children) };
          }
          return task;
        });
      };
      
      setTasks(updateTaskInTree);
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task');
    }
  }, []);

  // Load tasks from backend on component mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add a child to a task using backend API
  const addChildTask = async (parentId) => {
    try {
      const newChild = await apiService.createTask('', parentId);
      setActiveTaskId(newChild.id);
      
      // Reload tasks to get updated structure
      await loadTasks();
    } catch (error) {
      console.error('Failed to add child task:', error);
      setError('Failed to add child task');
    }
  };

  // Split a task using AI backend
  const splitTask = async (taskId) => {
    try {
      console.log('Splitting task with AI:', taskId);
      
      // Use AI to split the task
      const splitResponse = await apiService.splitTask(taskId);
      console.log('AI split response:', splitResponse);
      
      // Reload tasks to get the updated structure with new subtasks
      await loadTasks();
      
      // Set the first subtask as active if available
      const updatedTasks = await apiService.getTasks();
      const parentTask = findTaskInTree(updatedTasks, taskId);
      if (parentTask && parentTask.children.length > 0) {
        setActiveTaskId(parentTask.children[0].id);
      }
    } catch (error) {
      console.error('Failed to split task:', error);
      setError('Failed to split task with AI');
    }
  };

  // Activate a task
  const activateTask = async (taskId) => {
    setActiveTaskId(taskId);
    await updateTask(taskId, { isEditing: true });
  };

  // Deactivate task (stop editing and clear active)
  const deactivateTask = async (taskId) => {
    setActiveTaskId(null);
    await updateTask(taskId, { isEditing: false });
  };

  // Generate AI Notes for a task
  const generateAINotes = async (taskId) => {
    try {
      console.log('🤖 Generating AI notes for task:', taskId);
      const notesResponse = await apiService.generateNotes(taskId);
      console.log('AI Notes generated:', notesResponse);
      
      // For now, just log the notes. You can implement a modal or notification later
      alert(`AI Notes for "${notesResponse.task_title}":\n\n${notesResponse.notes}`);
    } catch (error) {
      console.error('Failed to generate AI notes:', error);
      setError('Failed to generate AI notes');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-container w-full">
        <div className="content-wrapper w-full px-16 py-8">
          <div className="header-section mb-6 ml-12">
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          </div>
          <div className="text-gray-400 ml-20">
            Loading tasks...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-container w-full">
        <div className="content-wrapper w-full px-16 py-8">
          <div className="header-section mb-6 ml-12">
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          </div>
          <div className="ml-20">
            <div className="text-red-400 mb-4">{error}</div>
            <button 
              onClick={loadTasks}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container w-full">
      <div className="content-wrapper w-full px-16 py-8">
        <div className="header-section mb-6 ml-12">
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
        </div>
        <div className="tasks-container w-full space-y-4 ml-20">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              depth={0}
              activeTaskId={activeTaskId}
              onUpdate={updateTask}
              onAddChild={addChildTask}
              onSplit={splitTask}
              onRemove={removeTask}
              onActivate={activateTask}
              onDeactivate={deactivateTask}
              onAINotes={generateAINotes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
