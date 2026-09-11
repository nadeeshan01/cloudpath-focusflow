import { useEffect, useMemo, useState } from "react";

import api, { getApiErrorMessage } from "../api/client";
import AppLayout from "../components/AppLayout";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTasks() {
    try {
      setError("");

      const response = await api.get("/tasks");
      const taskData = response.data?.data;
      const taskList = Array.isArray(taskData)
        ? taskData
        : Array.isArray(taskData?.tasks)
        ? taskData.tasks
        : [];

      setTasks(taskList);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  async function createTask(taskPayload) {
    try {
      setError("");
      setMessage("");
      setIsCreating(true);

      const response = await api.post("/tasks", taskPayload);
      const newTask = response.data?.data?.task || response.data?.data;

      if (newTask) {
        setTasks((currentTasks) => [newTask, ...currentTasks]);
      }

      setMessage("Task created successfully.");

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));

      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function updateTask(taskId, taskPayload) {
    try {
      setError("");
      setMessage("");
      setIsUpdatingId(taskId);

      const response = await api.patch(
        `/tasks/${taskId}`,
        taskPayload,
      );

      const updatedTask = response.data?.data?.task || response.data?.data;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          (task._id === taskId || task.id === taskId) ? updatedTask : task,
        ),
      );

      setMessage("Task updated successfully.");

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));

      return false;
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function deleteTask(taskId) {
    try {
      setError("");
      setMessage("");
      setIsDeletingId(taskId);

      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId && task.id !== taskId),
      );

      setMessage("Task deleted successfully.");

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));

      return false;
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Productivity</p>
          <h1>Tasks</h1>
          <p className="muted">
            Create, organise, update, and complete your tasks.
          </p>
        </div>
      </section>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <TaskForm
        onCreate={createTask}
        isSubmitting={isCreating}
      />

      <section className="panel filter-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Filter</p>
            <h2>View tasks</h2>
          </div>

          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="form-grid">
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label>
            Priority
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      </section>

      {isLoading ? (
        <div className="page-center-small">
          Loading tasks...
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          isUpdatingId={isUpdatingId}
          isDeletingId={isDeletingId}
        />
      )}
    </AppLayout>
  );
}