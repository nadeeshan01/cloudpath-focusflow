import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../api/client";
import AppLayout from "../components/AppLayout";

const STATUS_OPTIONS = ["todo", "in_progress", "done"];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

const statusLabels = { todo: "To Do", in_progress: "In Progress", done: "Done" };

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.data.tasks);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function handleEdit(task) {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };

    try {
      if (editingId) {
        await api.patch(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchTasks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Productivity</p>
          <h1>Tasks</h1>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-column-grid">
        <div className="panel">
          <h2>{editingId ? "Edit Task" : "New Task"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} required maxLength={160} />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} maxLength={2000} />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select name="priority" value={form.priority} onChange={handleChange}>
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Due Date
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="button button-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update Task" : "Create Task"}
              </button>
              {editingId && (
                <button className="button button-secondary" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <h2>Task List ({tasks.length})</h2>

          {loading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks yet. Create one!</p>
          ) : (
            <ul className="simple-list">
              {tasks.map((task) => (
                <li key={task._id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {statusLabels[task.status]} &middot; {task.priority}
                      {task.dueDate && <> &middot; Due {new Date(task.dueDate).toLocaleDateString()}</>}
                    </span>
                    {task.description && (
                      <span style={{ fontSize: "0.85rem" }}>{task.description}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button className="button button-secondary" type="button" style={{ padding: "4px 10px", minHeight: 0, fontSize: "0.8rem" }} onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="button button-secondary" type="button" style={{ padding: "4px 10px", minHeight: 0, fontSize: "0.8rem", color: "#8f1d30" }} onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
