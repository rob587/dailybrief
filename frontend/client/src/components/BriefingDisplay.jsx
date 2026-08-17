import { useState } from "react";
import { generateBriefing } from "../services/apiService";

const UMORE_OPTIONS = [
  { value: "ottimo", label: "😄 Ottimo" },
  { value: "bene", label: "🙂 Bene" },
  { value: "normale", label: "😐 Normale" },
  { value: "stanco", label: "😴 Stanco" },
  { value: "stressato", label: "😰 Stressato" },
];

const BriefingDisplay = ({ tasks }) => {
  const [briefing, setBriefing] = useState(null);
  const [umore, setUmore] = useState("normale");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!tasks || tasks.filter((t) => t.stato !== "done").length === 0) {
      setError(
        "Aggiungi almeno un task non completato per generare il briefing!",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await generateBriefing(umore);
      setBriefing(data.briefing);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3
            key={i}
            style={{ color: "#a78bfa", marginTop: "16px", marginBottom: "6px" }}
          >
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.startsWith("**")) {
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} style={{ margin: "4px 0", lineHeight: "1.7" }}>
          {line}
        </p>
      );
    });
  };

  return (
    <>
      <div className="briefing-container">
        <div className="briefing-controls">
          <h2>Briefing Giornaliero</h2>

          <div className="umore-selector">
            <label>Come ti senti oggi?</label>
            <div className="umore-options">
              {UMORE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setUmore(opt.value)}
                  className={`umore-btn ${umore === opt.value ? "umore-active" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <button
            className="btn-primary btn-generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-inline" />
                Generazione in corso...
              </>
            ) : (
              "✨ Genera Briefing"
            )}
          </button>
        </div>

        {briefing && (
          <div className="briefing-result">
            <div className="briefing-meta">
              <span>{formatDate(briefing.created_at)}</span>
              <span>{briefing.tasks_count} task analizzati</span>
              {briefing.umore && (
                <span>
                  {UMORE_OPTIONS.find((o) => o.value === briefing.umore)?.label}
                </span>
              )}
            </div>

            <div className="briefing-content">
              {renderContent(briefing.contenuto)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BriefingDisplay;
