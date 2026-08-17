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

  return <div></div>;
};

export default BriefingHistory;
