import { useState } from "react";

const initialForm = {
  title: "",
  content: "",
  mood: "neutral",
  entryDate: new Date().toISOString().slice(0, 10),
  tagsText: "",
};

function convertTags(tagsText) {
  return [
    ...new Set(
      tagsText
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export default function JournalForm({
  onCreate,
  isSubmitting,
}) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const entryPayload = {
      title: form.title.trim(),
      content: form.content.trim(),
      mood: form.mood,
      entryDate: new Date(
        `${form.entryDate}T00:00:00.000Z`,
      ).toISOString(),
      tags: convertTags(form.tagsText),
    };

    const wasCreated = await onCreate(entryPayload);

    if (wasCreated) {
      setForm({
        ...initialForm,
        entryDate: new Date().toISOString().slice(0, 10),
      });
    }
  }

  return (
    <form className="panel journal-form" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New entry</p>
          <h2>Write in your journal</h2>
        </div>
      </div>

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Example: Productive development day"
          maxLength="160"
          required
        />
      </label>

      <label>
        Entry
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write what happened, what you learned, or what you plan next..."
          rows="7"
          maxLength="10000"
          required
        />
      </label>

      <div className="form-grid">
        <label>
          Mood
          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
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
            value={form.entryDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tags
          <input
            name="tagsText"
            value={form.tagsText}
            onChange={handleChange}
            placeholder="backend, devops, learning"
            maxLength="300"
          />
        </label>
      </div>

      <p className="field-help">
        Separate tags with commas. Maximum 10 tags.
      </p>

      <button
        className="button button-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving entry..." : "Save journal entry"}
      </button>
    </form>
  );
}