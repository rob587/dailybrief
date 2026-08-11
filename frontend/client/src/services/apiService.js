const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const registerUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore registrazione");
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore login");
  return data;
};

// task section
export const fetchTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore fetch tasks");
  return data;
};

export const createTask = async (titolo, priorita, note) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ titolo, priorita, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore creazione task");
  return data;
};
