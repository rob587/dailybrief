import { useState, useEffect } from "react";
import { fetchBriefingHistory } from "../services/apiService";

const UMORE_LABELS = {
  ottimo: "😄 Ottimo",
  bene: "🙂 Bene",
  normale: "😐 Normale",
  stanco: "😴 Stanco",
  stressato: "😰 Stressato",
};

const BriefingHistory = () => {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBriefingHistory();
        setBriefings(data.briefings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPreview = (text) => {
    const clean = text.replace(/\*\*/g, "");
    return clean.length > 150 ? clean.slice(0, 150) + "..." : clean;
  };

  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3
            key={i}
            style={{
              color: "#a78bfa",
              marginTop: "16px",
              marginBottom: "6px",
            }}
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

  return <div></div>;
};

export default BriefingHistory;
