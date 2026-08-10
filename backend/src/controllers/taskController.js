import pool from "../config/database";

export const getTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY FIELD(priorita, 'alta', 'media', 'bassa'), created_at DESC",
      [req.user.id],
    );

    res.json({ tasks });
  } catch (err) {
    console.error("Errore getTasks:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createTask = async (req, res) => {
  const { titolo, priorita = "media", note = "" } = req.body;

  if (!titolo) {
    return res.status(400).json({ error: "Il titolo è obbligatorio" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, titolo, priorita, note) VALUES (?, ?, ?, ?)",
      [req.user.id, titolo, priorita, note],
    );

    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({ task: newTask[0] });
  } catch (err) {
    console.error("Errore createTask:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};
