import { useEffect, useMemo, useState } from "react";

import api, { getApiErrorMessage } from "../api/client";
import AppLayout from "../components/AppLayout";
import JournalForm from "../components/JournalForm";
import JournalList from "../components/JournalList";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [moodFilter, setMoodFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadJournalEntries() {
    try {
      setError("");

      const response = await api.get("/journal");

      setEntries(response.data.data.entries);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    const normalizedTag = tagFilter.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesMood =
        moodFilter === "all" || entry.mood === moodFilter;

      const matchesTag =
        !normalizedTag ||
        entry.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedTag),
        );

      return matchesMood && matchesTag;
    });
  }, [entries, moodFilter, tagFilter]);

  async function createJournalEntry(entryPayload) {
    try {
      setError("");
      setMessage("");
      setIsCreating(true);

      const response = await api.post("/journal", entryPayload);

      setEntries((currentEntries) => [
        response.data.data.entry,
        ...currentEntries,
      ]);

      setMessage("Journal entry created successfully.");

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));

      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function updateJournalEntry(entryId, entryPayload) {
    try {
      setError("");
      setMessage("");
      setIsUpdatingId(entryId);

      const response = await api.patch(
        `/journal/${entryId}`,
        entryPayload,
      );

      const updatedEntry = response.data.data.entry;

      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry._id === entryId ? updatedEntry : entry,
        ),
      );

      setMessage("Journal entry updated successfully.");

      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));

      return false;
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function deleteJournalEntry(entryId) {
    try {
      setError("");
      setMessage("");
      setIsDeletingId(entryId);

      await api.delete(`/journal/${entryId}`);

      setEntries((currentEntries) =>
        currentEntries.filter((entry) => entry._id !== entryId),
      );

      setMessage("Journal entry deleted successfully.");

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
          <p className="eyebrow">Reflection</p>
          <h1>Journal</h1>
          <p className="muted">
            Record your progress, thoughts, and learning journey.
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

      <JournalForm
        onCreate={createJournalEntry}
        isSubmitting={isCreating}
      />

      <section className="panel filter-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Filter</p>
            <h2>View journal entries</h2>
          </div>

          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setMoodFilter("all");
              setTagFilter("");
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="form-grid">
          <label>
            Mood
            <select
              value={moodFilter}
              onChange={(event) =>
                setMoodFilter(event.target.value)
              }
            >
              <option value="all">All moods</option>
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="neutral">Neutral</option>
              <option value="bad">Bad</option>
            </select>
          </label>

          <label>
            Search tag
            <input
              value={tagFilter}
              onChange={(event) =>
                setTagFilter(event.target.value)
              }
              placeholder="Example: devops"
            />
          </label>
        </div>
      </section>

      {isLoading ? (
        <div className="page-center-small">
          Loading journal entries...
        </div>
      ) : (
        <JournalList
          entries={filteredEntries}
          onUpdate={updateJournalEntry}
          onDelete={deleteJournalEntry}
          isUpdatingId={isUpdatingId}
          isDeletingId={isDeletingId}
        />
      )}
    </AppLayout>
  );
}