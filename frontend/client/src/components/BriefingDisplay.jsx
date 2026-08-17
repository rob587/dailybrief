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
  return <div></div>;
};

export default BriefingDisplay;
