import { useState } from "react";

function formatStatus(status) {
  const labels = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done",
  };

  return labels[status] || status;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  isUpdatingId,
  isDeletingId,
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  function startEditing(task) {
    setEditingTaskId(task._id);

    setEditingForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditingForm({});
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditingForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveTask(taskId) {
    const updatedTask = {
      title: editingForm.title.trim(),
      description: editingForm.description.trim(),
      status: editingForm.status,
      priority: editingForm.priority,
      dueDate: editingForm.dueDate
        ? new Date(
            `${editingForm.dueDate}T00:00:00.000Z`,
          ).toISOString()
        : null,
    };

    const wasUpdated = await onUpdate(taskId, updatedTask);

    if (wasUpdated) {
      cancelEditing();
    }
  }

  async function changeStatus(task, status) {
    await onUpdate(task._id, { status });
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This cannot be undone.`,
    );

    if (confirmed) {
      await onDelete(task._id);
    }
  }

  if (tasks.length === 0) {
    return (
      <section className="panel">
        <h2>Your tasks</h2>

        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task using the form above.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Your work</p>
          <h2>Your tasks</h2>
        </div>

        <span className="count-badge">
          {tasks.length}
        </span>
      </div>

      <div className="task-list">
        {tasks.map((task) => {
          const isEditing = editingTaskId === task._id;
          const isUpdating = isUpdatingId === task._id;
          const isDeleting = isDeletingId === task._id;

          return (
            <article
              className={`task-card task-status-${task.status}`}
              key={task._id}
            >
              {isEditing ? (
                <div className="task-edit-form">
                  <label>
                    Title
                    <input
                      name="title"
                      value={editingForm.title}
                      onChange={handleEditChange}
                      maxLength="160"
                      required
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      name="description"
                      value={editingForm.description}
                      onChange={handleEditChange}
                      rows="3"
                      maxLength="2000"
                    />
                  </label>

                  <div className="form-grid">
                    <label>
                      Status
                      <select
                        name="status"
                        value={editingForm.status}
                        onChange={handleEditChange}
                      >
                        <option value="todo">To do</option>
                        <option value="in_progress">
                          In progress
                        </option>
                        <option value="done">Done</option>
                      </select>
                    </label>

                    <label>
                      Priority
                      <select
                        name="priority"
                        value={editingForm.priority}
                        onChange={handleEditChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>

                    <label>
                      Due date
                      <input
                        name="dueDate"
                        type="date"
                        value={editingForm.dueDate}
                        onChange={handleEditChange}
                      />
                    </label>
                  </div>

                  <div className="action-row">
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={isUpdating}
                      onClick={() => saveTask(task._id)}
                    >
                      {isUpdating ? "Saving..." : "Save changes"}
                    </button>

                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={isUpdating}
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-card-header">
                    <div>
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p className="muted">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`priority-badge priority-${task.priority}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="task-meta">
                    <span>
                      Due: {formatDate(task.dueDate)}
                    </span>

                    <span>
                      Status: {formatStatus(task.status)}
                    </span>
                  </div>

                  <div className="action-row">
                    <select
                      aria-label={`Change status for ${task.title}`}
                      value={task.status}
                      disabled={isUpdating || isDeleting}
                      onChange={(event) =>
                        changeStatus(task, event.target.value)
                      }
                    >
                      <option value="todo">To do</option>
                      <option value="in_progress">
                        In progress
                      </option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="button button-danger"
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => handleDelete(task)}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}