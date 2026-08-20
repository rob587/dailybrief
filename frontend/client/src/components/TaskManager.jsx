import { useState, useEffect } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/apiService";

const PRIORITA_COLORS = {
  alta: "#ef4444",
  media: "#fbbf24",
  bassa: "#34d399",
};

const STATO_LABELS = {
  todo: "Da fare",
  in_progress: "In corso",
  done: "Completato",
};

const TaskManager = ({ onTasksChange }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ titolo: "", priorita: "media", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data.tasks);
      onTasksChange?.(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.titolo.trim()) return;
    setSubmitting(true);
    try {
      const data = await createTask(form.titolo, form.priorita, form.note);
      const updatedTasks = [data.task, ...tasks];
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
      setForm({ titolo: "", priorita: "media", note: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStato = async (id, stato) => {
    try {
      const data = await updateTask(id, { stato });
      const updatedTasks = tasks.map((t) => (t.id === id ? data.task : t));
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
        Caricamento task...
      </div>
    );

  return (
    <div className="task-manager">
      <div className="task-header">
        <h2>📝 I tuoi Task</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Annulla" : "+ Nuovo Task"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="task-form">
          <div className="form-group">
            <label>Titolo</label>
            <input
              type="text"
              value={form.titolo}
              onChange={(e) => setForm({ ...form, titolo: e.target.value })}
              placeholder="Cosa devi fare?"
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priorità</label>
              <select
                value={form.priorita}
                onChange={(e) => setForm({ ...form, priorita: e.target.value })}
              >
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="bassa">🟢 Bassa</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Note (opzionale)</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Aggiungi dettagli..."
              rows={2}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Salvataggio..." : "Aggiungi Task"}
          </button>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>🎯 Nessun task ancora.</p>
          <p>Aggiungine uno per generare il tuo briefing!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.stato === "done" ? "task-done" : ""}`}
              style={{
                borderLeft: `3px solid ${PRIORITA_COLORS[task.priorita]}`,
              }}
            >
              <div className="task-card-header">
                <div className="task-info">
                  <span
                    className="task-title"
                    style={{
                      textDecoration:
                        task.stato === "done" ? "line-through" : "none",
                    }}
                  >
                    {task.titolo}
                  </span>
                  <div className="task-meta">
                    <span
                      style={{
                        color: PRIORITA_COLORS[task.priorita],
                        fontSize: "0.78rem",
                      }}
                    >
                      ● {task.priorita}
                    </span>
                    {task.note && (
                      <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                        · {task.note}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <select
                    value={task.stato}
                    onChange={(e) => handleUpdateStato(task.id, e.target.value)}
                    className="stato-select"
                  >
                    {Object.entries(STATO_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn-delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
