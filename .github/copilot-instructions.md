# Stepwise Project - AI Coding Instructions

## Project Overview
Stepwise is a task management application with hierarchical task splitting capabilities, featuring a React frontend and FastAPI backend.

## Architecture

### Frontend Structure (React)
- **Location**: `e:\Stepwise\frontend\src\`
- **Framework**: React with JSX
- **Styling**: Tailwind CSS classes
- **Key Components**: 
  - `TaskTree.jsx` - Hierarchical task display with expand/collapse
  - Task splitting functionality with AI-powered subtask generation

### Backend Structure
- **Location**: `e:\Stepwise\backend\`
- **Framework**: FastAPI with Uvicorn, Pydantic validation
- **Dependencies**: See `requirements.txt`

## Key Patterns

### Task Management Pattern
```jsx
// Tasks have hierarchical structure with subtasks
const task = {
  id: 'unique-id',
  title: 'Task description',
  completed: boolean,
  subtasks: [...] // recursive structure
}
```

### Component State Management
- Use `useState` for local component state (expanded, loading, showNotes)
- Tasks are mutated directly: `task.completed = !task.completed`
- Async operations use loading states with setTimeout simulation

### UI Conventions
- **Colors**: Purple theme (`purple-600`, `purple-700`) for primary actions
- **Spacing**: 24px left margin per nesting level
- **Icons**: Heroicons SVG for expand/collapse arrows
- **Loading**: Tailwind animate-spin for async operations

### Task Tree Features
- **Expansion**: Click arrows to expand/collapse subtasks
- **Splitting**: "Split" button generates 3 subtasks (simulated API call)
- **Notes**: "AI Notes" toggle shows inline tips
- **Completion**: Checkbox with strikethrough styling

## Development Workflow

### Frontend Development
```bash
cd frontend
npm install
npm start  # or npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # assuming main.py exists
```

## Code Style
- Use functional components with hooks
- Tailwind for all styling (no custom CSS)
- ES6+ syntax (destructuring, arrow functions)
- Consistent 2-space indentation
- Event handlers prefixed with `handle` or `toggle`

## Integration Points
- Task splitting likely calls backend API (currently mocked)
- Notes system may integrate with AI backend
- State management appears local (no Redux/Context visible)
