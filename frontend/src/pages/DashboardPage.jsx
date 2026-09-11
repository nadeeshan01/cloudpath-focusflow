import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import AppLayout from "../components/AppLayout";

const moodEmoji = { great: "😄", good: "🙂", neutral: "😐", bad: "😞" };

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data.data);
      } catch {
        setError("Failed to load dashboard summary.");
      }
    }
    fetchSummary();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {!summary && !error && <p className="muted">Loading summary...</p>}

      {summary && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Tasks</span>
              <strong>{summary.taskCounts.total}</strong>
            </div>
            <div className="stat-card">
              <span>To Do</span>
              <strong>{summary.taskCounts.todo}</strong>
            </div>
            <div className="stat-card">
              <span>In Progress</span>
              <strong>{summary.taskCounts.inProgress}</strong>
            </div>
            <div className="stat-card">
              <span>Done</span>
              <strong>{summary.taskCounts.done}</strong>
            </div>
            <div className="stat-card">
              <span>High Priority</span>
              <strong>{summary.taskCounts.highPriority}</strong>
            </div>
            <div className="stat-card">
              <span>Overdue</span>
              <strong>{summary.taskCounts.overdue}</strong>
            </div>
          </div>

          <div className="two-column-grid">
            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Recent Tasks</h2>
                <Link to="/tasks" className="button button-secondary" style={{ padding: "6px 12px", minHeight: 0, fontSize: "0.85rem" }}>
                  View all
                </Link>
              </div>

              {summary.recentTasks.length === 0 ? (
                <p className="muted">No tasks yet.</p>
              ) : (
                <ul className="simple-list">
                  {summary.recentTasks.map((task) => (
                    <li key={task._id}>
                      <div>
                        <strong>{task.title}</strong>
                        <span>
                          {task.status.replace("_", " ")} &middot; {task.priority}
                          {task.dueDate && <> &middot; Due {new Date(task.dueDate).toLocaleDateString()}</>}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Recent Journal Entries</h2>
                <Link to="/journal" className="button button-secondary" style={{ padding: "6px 12px", minHeight: 0, fontSize: "0.85rem" }}>
                  View all
                </Link>
              </div>

              {summary.recentJournalEntries.length === 0 ? (
                <p className="muted">No journal entries yet.</p>
              ) : (
                <ul className="simple-list">
                  {summary.recentJournalEntries.map((entry) => (
                    <li key={entry._id}>
                      <div>
                        <strong>{moodEmoji[entry.mood] || ""} {entry.title}</strong>
                        <span>
                          {new Date(entry.entryDate).toLocaleDateString()}
                          {entry.tags.length > 0 && <> &middot; {entry.tags.join(", ")}</>}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
