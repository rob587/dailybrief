import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskManager from "./components/TaskManager";
import BriefingDisplay from "./components/BriefingDisplay";
import BriefingHistory from "./components/BriefingHistory";

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState([]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#6b7280",
        }}
      >
        Caricamento...
      </div>
    );

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>📋 DailyBrief</h1>
          <span className="header-subtitle">Ciao, {user.username}! 👋</span>
        </div>
        <button className="btn-logout" onClick={logout}>
          Esci
        </button>
      </header>

      {/* Tabs */}
      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === "dashboard" ? "nav-tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          🏠 Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === "history" ? "nav-tab-active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📚 Storico
        </button>
      </nav>

      {/* Contenuto */}
      <main className="app-main">
        {activeTab === "dashboard" && (
          <div className="dashboard-grid">
            <div className="dashboard-left">
              <TaskManager onTasksChange={setTasks} />
            </div>
            <div className="dashboard-right">
              <BriefingDisplay tasks={tasks} />
            </div>
          </div>
        )}

        {activeTab === "history" && <BriefingHistory />}
      </main>

      <footer className="app-footer">
        <p>DailyBrief — Il tuo assistente AI giornaliero</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
