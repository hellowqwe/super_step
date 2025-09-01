// API service for backend communication
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  // Helper method for API calls
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like DELETE)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Task CRUD operations
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(title, parentId = null) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        parent_id: parentId,
      }),
    });
  }

  async updateTask(taskId, updates) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async clearAllTasks() {
    return this.request('/tasks', {
      method: 'DELETE',
    });
  }

  // AI-powered operations
  async splitTask(taskId, context = null) {
    const body = context ? { context } : {};
    return this.request(`/tasks/${taskId}/split`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async generateNotes(taskId) {
    return this.request(`/tasks/${taskId}/notes`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
