from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import uuid
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Groq configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

if not GROQ_API_KEY:
    print("Warning: GROQ_API_KEY not found in environment variables")

# Initialize FastAPI app
app = FastAPI(
    title="Stepwise Task Manager API",
    description="Simple task management API with AI-powered task splitting",
    version="1.0.0"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Task(BaseModel):
    id: str
    title: str
    completed: bool = False
    created_at: str
    children: List['Task'] = []

class TaskCreate(BaseModel):
    title: str
    parent_id: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TaskSplitRequest(BaseModel):
    context: Optional[str] = None  # Additional context for splitting

class TaskSplitResponse(BaseModel):
    subtasks: List[str]
    reasoning: Optional[str] = None

# Groq API helper functions
async def call_groq_api(prompt: str, model: str = "llama-3.3-70b-versatile") -> str:
    """Call Groq API with the given prompt"""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You break tasks into 3 actionable steps. Be concise and specific."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 500,
        "temperature": 0.5
    }
    
    try:
        async with httpx.AsyncClient() as client:
            print(f"Making request to Groq API with model: {model}")
            print(f"Prompt: {prompt[:100]}...")
            
            response = await client.post(
                f"{GROQ_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code != 200:
                error_text = response.text
                print(f"Error response: {error_text}")
                raise HTTPException(status_code=500, detail=f"Groq API error {response.status_code}: {error_text}")
            
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            print(f"AI Response: {content[:100]}...")
            return content
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=500, detail="Groq API timeout - request took too long")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Network error calling Groq API: {str(e)}")
    except KeyError as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Groq API response format: missing {str(e)}")
    except Exception as e:
        print(f"Unexpected error in call_groq_api: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

def parse_subtasks_from_response(response: str) -> List[str]:
    """Parse exactly 3 subtasks from Groq response"""
    lines = response.strip().split('\n')
    subtasks = []
    
    for line in lines:
        line = line.strip()
        # Remove numbering, bullets, and dashes
        if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•') or line.startswith('*')):
            # Remove common prefixes
            clean_line = line
            for prefix in ['1.', '2.', '3.', '4.', '5.', '-', '•', '*']:
                if clean_line.startswith(prefix):
                    clean_line = clean_line[len(prefix):].strip()
                    break
            
            if clean_line and len(clean_line) > 3:  # Avoid very short tasks
                subtasks.append(clean_line)
    
    # If no numbered/bulleted items found, try to split by sentences
    if not subtasks:
        sentences = response.split('.')
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and len(sentence) > 10:
                subtasks.append(sentence)
    
    return subtasks[:3]  # Limit to exactly 3 subtasks

# JSON file storage
TASKS_FILE = "tasks.json"

def load_tasks() -> List[Task]:
    """Load tasks from JSON file"""
    if not os.path.exists(TASKS_FILE):
        return []
    
    try:
        with open(TASKS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [Task(**task) for task in data]
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_tasks(tasks: List[Task]):
    """Save tasks to JSON file"""
    with open(TASKS_FILE, 'w', encoding='utf-8') as f:
        json.dump([task.dict() for task in tasks], f, indent=2, ensure_ascii=False)

def find_task_by_id(tasks: List[Task], task_id: str) -> Optional[Task]:
    """Recursively find a task by ID"""
    for task in tasks:
        if task.id == task_id:
            return task
        found = find_task_by_id(task.children, task_id)
        if found:
            return found
    return None

def remove_task_by_id(tasks: List[Task], task_id: str) -> bool:
    """Recursively remove a task by ID"""
    for i, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(i)
            return True
        if remove_task_by_id(task.children, task_id):
            return True
    return False

def add_child_task(tasks: List[Task], parent_id: str, new_task: Task) -> bool:
    """Add a child task to a parent"""
    parent = find_task_by_id(tasks, parent_id)
    if parent:
        parent.children.append(new_task)
        return True
    return False

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Stepwise Task Manager API is running!", "status": "healthy"}

@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    tasks = load_tasks()
    return tasks

@app.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate):
    """Create a new task"""
    tasks = load_tasks()
    
    # Create new task
    new_task = Task(
        id=str(uuid.uuid4()),
        title=task_data.title,
        created_at=datetime.now().isoformat(),
        children=[]
    )
    
    if task_data.parent_id:
        # Add as child task
        if not add_child_task(tasks, task_data.parent_id, new_task):
            raise HTTPException(status_code=404, detail="Parent task not found")
    else:
        # Add as root task
        tasks.append(new_task)
    
    save_tasks(tasks)
    return new_task

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str):
    """Get a specific task by ID"""
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update a task"""
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.completed is not None:
        task.completed = task_update.completed
    
    save_tasks(tasks)
    return task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task and all its children"""
    tasks = load_tasks()
    
    if not remove_task_by_id(tasks, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    
    save_tasks(tasks)
    return {"message": "Task deleted successfully"}

@app.delete("/tasks")
async def clear_all_tasks():
    """Clear all tasks (useful for testing)"""
    if os.path.exists(TASKS_FILE):
        os.remove(TASKS_FILE)
    return {"message": "All tasks cleared successfully"}

# AI-powered endpoints

@app.post("/tasks/{task_id}/split", response_model=TaskSplitResponse)
async def split_task_with_ai(task_id: str, split_request: TaskSplitRequest = TaskSplitRequest()):
    """Use AI to split a task into exactly 3 subtasks"""
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Create prompt for Groq
    context_part = f" Context: {split_request.context}." if split_request.context else ""
    
    prompt = f"""Break "{task.title}" into exactly 3 steps.{context_part}

Format:
1. [Step 1]
2. [Step 2] 
3. [Step 3]"""
    
    try:
        # Get AI response
        ai_response = await call_groq_api(prompt)
        subtasks = parse_subtasks_from_response(ai_response)
        
        # Ensure we have exactly 3 subtasks
        if len(subtasks) < 3:
            # Pad with generic subtasks if needed
            while len(subtasks) < 3:
                subtasks.append(f"Complete part {len(subtasks) + 1} of: {task.title}")
        
        # Take only the first 3
        subtasks = subtasks[:3]
        
        # Create and add subtasks to the parent task
        for subtask_title in subtasks:
            new_subtask = Task(
                id=str(uuid.uuid4()),
                title=subtask_title,
                created_at=datetime.now().isoformat(),
                children=[]
            )
            task.children.append(new_subtask)
        
        # Save updated tasks
        save_tasks(tasks)
        
        return TaskSplitResponse(
            subtasks=subtasks,
            reasoning=f"Generated exactly 3 subtasks for: {task.title}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to split task: {str(e)}")

@app.post("/tasks/{task_id}/notes")
async def generate_task_notes(task_id: str):
    """Generate precise, factual AI notes for a task"""
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    prompt = f"""Brief tips for: "{task.title}"

Give 2-3 short points only. Be concise."""
    
    try:
        ai_response = await call_groq_api(prompt, model="llama-3.3-70b-versatile")
        return {
            "task_id": task_id, 
            "task_title": task.title,
            "notes": ai_response.strip(),
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate notes: {str(e)}")

# Development server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
