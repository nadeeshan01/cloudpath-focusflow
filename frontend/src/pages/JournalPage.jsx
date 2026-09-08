import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../api/client";
import AppLayout from "../components/AppLayout";

const moods = [
  { value: "great", label: "😄 Great" },
  { value: "good", label: "🙂 Good" },
  { value: "neutral", label: "😐 Neutral" },
  { value: "bad", label: "😞 Bad" },
];

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "neutral",
    tagsInput: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadEntries() {
    try {
      setError("");
      const response = await api.get("/journal");
      const data = response.data?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.entries)
        ? data.entries
        : [];
      setEntries(list);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const tags = form.tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const response = await api.post("/journal", {
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags,
      });

      const newEntry = response.data?.data?.entry || response.data?.data;
      if (newEntry) {
        setEntries((current) => [newEntry, ...current]);
      }

      setForm({
        title: "",
        content: "",
        mood: "neutral",
        tagsInput: "",
      });
      setMessage("Journal entry added successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(entryId, title) {
    if (!window.confirm(`Delete journal entry "${title}"?`)) return;

    try {
      setError("");
      await api.delete(`/journal/${entryId}`);
      setEntries((current) =>
        current.filter((e) => e._id !== entryId && e.id !== entryId)
      );
      setMessage("Journal entry deleted.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Reflection</p>
          <h1>Journal</h1>
          <p className="muted">
            Capture your daily thoughts, mood, and reflections.
          </p>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form className="panel task-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">New Reflection</p>
            <h2>Write a journal entry</h2>
          </div>
        </div>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What's on your mind today?"
            maxLength="160"
            required
          />
        </label>

        <label>
          Content
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your entry details here..."
            rows="5"
            maxLength="10000"
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Mood
            <select name="mood" value={form.mood} onChange={handleChange}>
              {moods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Tags (comma separated)
            <input
              name="tagsInput"
              value={form.tagsInput}
              onChange={handleChange}
              placeholder="e.g. devops, learning, goal"
            />
          </label>
        </div>

        <button
          className="button button-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving entry..." : "Save entry"}
        </button>
      </form>

      {isLoading ? (
        <div className="page-center-small">Loading journal entries...</div>
      ) : (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2>Your Journal Entries</h2>
            </div>
            <span className="count-badge">{entries.length}</span>
          </div>

          {entries.length === 0 ? (
            <div className="empty-state">
              <h3>No journal entries yet</h3>
              <p>Write your first reflection using the form above.</p>
            </div>
          ) : (
            <div className="task-list">
              {entries.map((entry) => {
                const entryId = entry._id || entry.id;
                const moodObj = moods.find((m) => m.value === entry.mood);

                return (
                  <article className="task-card" key={entryId}>
                    <div className="task-card-header">
                      <div>
                        <h3>
                          {moodObj?.label.slice(0, 2)} {entry.title}
                        </h3>
                        <p className="muted" style={{ whiteSpace: "pre-wrap" }}>
                          {entry.content}
                        </p>
                      </div>
                      <span className="priority-badge priority-medium">
                        {entry.mood}
                      </span>
                    </div>

                    <div className="task-meta">
                      <span>
                        Date:{" "}
                        {new Date(
                          entry.entryDate || entry.createdAt
                        ).toLocaleDateString()}
                      </span>
                      {entry.tags && entry.tags.length > 0 && (
                        <span>Tags: {entry.tags.join(", ")}</span>
                      )}
                    </div>

                    <div className="action-row">
                      <button
                        className="button button-danger"
                        type="button"
                        onClick={() => handleDelete(entryId, entry.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </AppLayout>
  );
}