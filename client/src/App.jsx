import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const completedCount = tasks.filter(task => task.done).length;

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await axios.get(`${API}/api/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(`${API}/api/tasks`, {
        title: title.trim()
      });

      setTasks([...tasks, response.data]);
      setTitle("");
      setError("");
    } 
    catch (err) {
      setError("Unable to add task.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await axios.put(
        `${API}/api/tasks/${task.id}`,
        { done: !task.done }
      );

      setTasks(tasks.map(t =>
        t.id === task.id ? response.data : t));
    } 
    catch (err) {
      setError("Unable to update task.");
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      setError("");
    } 
    catch (err) {
      setError("Unable to delete task.");
    }
  }

  return (
    <div className="page">
      <div className="todo-container">
        <h1>To-Do List</h1>
        <div className="task-stats">
          <p>Tasks: {tasks.length}</p>
          <p>Done: {completedCount}</p>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Enter a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
        {loading && <p>Loading tasks...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && tasks.length === 0 && (
          <p className="empty">No tasks yet. Add your first task!</p>
        )}

        <div className="task-list">
          {tasks.map(task => (
            <div className="task-item" key={task.id}>
              <span
                className={task.done ? "completed" : ""}
                onClick={() => toggleTask(task)}
                title="Click to change task status"
              >
                {task.title}
              </span>

              <button
                className="delete-btn" onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;