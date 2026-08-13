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
  const [form, setForm] = useState({
    titolo: "",
    priorita: "media",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return <div></div>;
};

export default TaskManager;
