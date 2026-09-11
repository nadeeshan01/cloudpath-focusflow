import { useState } from "react";

function formatDate(dateValue) {
  if (!dateValue) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

function formatMood(mood) {
  const moods = {
    great: "Great",
    good: "Good",
    neutral: "Neutral",
    bad: "Bad",
  };

  return moods[mood] || mood;
}

function tagsToText(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

function parseTags(tagsText) {
  return [
    ...new Set(
      tagsText
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export default function JournalList({
  entries,
  onUpdate,
  onDelete,
  isUpdatingId,
  isDeletingId,
}) {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  function startEditing(entry) {
    setEditingEntryId(entry._id);

    setEditingForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      entryDate: entry.entryDate
        ? entry.entryDate.slice(0, 10)
        : "",
      tagsText: tagsToText(entry.tags),
    });
  }

  function cancelEditing() {
    setEditingEntryId(null);
    setEditingForm({});
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditingForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveEntry(entryId) {
    const updatedEntry = {
      title: editingForm.title.trim(),
      content: editingForm.content.trim(),
      mood: editingForm.mood,
      entryDate: new Date(
        `${editingForm.entryDate}T00:00:00.000Z`,
      ).toISOString(),
      tags: parseTags(editingForm.tagsText),
    };

    const wasUpdated = await onUpdate(entryId, updatedEntry);

    if (wasUpdated) {
      cancelEditing();
    }
  }

  async function handleDelete(entry) {
    const confirmed = window.confirm(
      `Delete journal entry "${entry.title}"? This cannot be undone.`,
    );

    if (confirmed) {
      await onDelete(entry._id);
    }
  }

  if (entries.length === 0) {
    return (
      <section className="panel">
        <h2>Your journal entries</h2>

        <div className="empty-state">
          <h3>No journal entries found</h3>
          <p>Write your first journal entry using the form above.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Your reflections</p>
          <h2>Your journal entries</h2>
        </div>

        <span className="count-badge">
          {entries.length}
        </span>
      </div>

      <div className="journal-list">
        {entries.map((entry) => {
          const isEditing = editingEntryId === entry._id;
          const isUpdating = isUpdatingId === entry._id;
          const isDeleting = isDeletingId === entry._id;

          return (
            <article className="journal-card" key={entry._id}>
              {isEditing ? (
                <div className="journal-edit-form">
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
                    Entry
                    <textarea
                      name="content"
                      value={editingForm.content}
                      onChange={handleEditChange}
                      rows="6"
                      maxLength="10000"
                      required
                    />
                  </label>

                  <div className="form-grid">
                    <label>
                      Mood
                      <select
                        name="mood"
                        value={editingForm.mood}
                        onChange={handleEditChange}
                      >
                        <option value="great">Great</option>
                        <option value="good">Good</option>
                        <option value="neutral">Neutral</option>
                        <option value="bad">Bad</option>
                      </select>
                    </label>

                    <label>
                      Entry date
                      <input
                        name="entryDate"
                        type="date"
                        value={editingForm.entryDate}
                        onChange={handleEditChange}
                      />
                    </label>

                    <label>
                      Tags
                      <input
                        name="tagsText"
                        value={editingForm.tagsText}
                        onChange={handleEditChange}
                        placeholder="backend, devops"
                      />
                    </label>
                  </div>

                  <div className="action-row">
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={isUpdating}
                      onClick={() => saveEntry(entry._id)}
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
                  <div className="journal-card-header">
                    <div>
                      <p className="journal-date">
                        {formatDate(entry.entryDate)}
                      </p>

                      <h3>{entry.title}</h3>
                    </div>

                    <span className={`mood-badge mood-${entry.mood}`}>
                      {formatMood(entry.mood)}
                    </span>
                  </div>

                  <p className="journal-content">
                    {entry.content}
                  </p>

                  {entry.tags?.length > 0 && (
                    <div className="tag-list">
                      {entry.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="action-row">
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => startEditing(entry)}
                    >
                      Edit
                    </button>

                    <button
                      className="button button-danger"
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => handleDelete(entry)}
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