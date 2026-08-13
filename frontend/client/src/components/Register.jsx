import { useState } from "react";
import { registerUser } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

const Register = ({ onSwitch }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("La password deve avere almeno 6 caratteri");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(form.username, form.email, form.password);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <div></div>;
};

export default Register;
