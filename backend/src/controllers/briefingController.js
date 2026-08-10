import pool from "../config/database.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateBriefing = async (req, res) => {
  const { umore } = req.body;

  try {
    // Prendo i task dell'utente
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? AND stato != 'done' ORDER BY FIELD(priorita, 'alta', 'media', 'bassa')",
      [req.user.id],
    );

    if (tasks.length === 0) {
      return res
        .status(400)
        .json({ error: "Nessun task trovato. Aggiungine qualcuno prima!" });
    }

    // Costruisco il prompt
    const tasksText = tasks
      .map(
        (t, i) =>
          `${i + 1}. [${t.priorita.toUpperCase()}] ${t.titolo}${t.note ? ` — Note: ${t.note}` : ""} (stato: ${t.stato})`,
      )
      .join("\n");

    const umoreText = umore ? `\nUmore dell'utente oggi: ${umore}` : "";

    const prompt = `Sei DailyBrief, un assistente personale AI che aiuta le persone a organizzare la loro giornata in modo efficace e motivante.

Utente: ${req.user.username}
Data: ${new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
Ora: ${new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}${umoreText}

Task da completare oggi:
${tasksText}

Genera un briefing giornaliero in italiano che includa:

1. **Saluto personalizzato** — saluta l'utente per nome in modo caldo e motivante
2. **Analisi della giornata** — valuta il carico di lavoro e l'umore se fornito
3. **Piano d'azione** — suggerisci un ordine ottimale per affrontare i task con una breve motivazione per ciascuno
4. **Consiglio del giorno** — un consiglio pratico su produttività o benessere
5. **Frase motivazionale** — chiudi con una frase che carichi l'utente

Sii concreto, umano e diretto. Usa emoji con moderazione. Lunghezza: 200-300 parole.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Sei un assistente personale AI chiamato DailyBrief. Parli sempre in italiano, sei motivante, concreto e umano. Non sei mai generico.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 1000,
    });

    const contenuto = response.choices[0]?.message?.content || "";

    // Salvo il briefing nel DB
    const [result] = await pool.query(
      "INSERT INTO briefings (user_id, contenuto, tasks_snapshot, umore) VALUES (?, ?, ?, ?)",
      [req.user.id, contenuto, JSON.stringify(tasks), umore || null],
    );

    res.json({
      success: true,
      briefing: {
        id: result.insertId,
        contenuto,
        umore: umore || null,
        tasks_count: tasks.length,
        created_at: new Date(),
      },
    });
  } catch (err) {
    console.error("Errore generateBriefing:", err);
    res.status(500).json({ error: "Errore nella generazione del briefing" });
  }
};
