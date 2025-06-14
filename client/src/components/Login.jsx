import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "../contexts/AuthContext";
import { cleanUsernameInput, validateUsername, cleanEmailInput, validateEmail, cleanPasswordInput, validatePassword, isFunctionalKey } from '../utils/validators';

const API_URL = import.meta.env.VITEDEV_API_URL || 'https://contact-manager-87bf.onrender.com/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clear error after 3 seconds
 useEffect(() => {
    if (error.email || error.password) {
      const timer = setTimeout(() => setError({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInput = (e, cleaner, setter) => {
    const cleanedValue = cleaner(e.target.value);
    setter(cleanedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' && !isFunctionalKey(e.key)) {
      e.preventDefault();
      const field = e.target.type === 'email' ? 'email' : 'password';
      setError({ ...error, [field]: 'Spaces are not allowed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    if (newError.email || newError.password) {
      setError(newError);
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      login(response.data.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      let errorMsg = 'Login failed';
      try {
        const parsedError = JSON.parse(err.response?.data?.message || '{}');
        errorMsg = parsedError.email || parsedError.password || err.response?.data?.message || errorMsg;
      } catch (parseErr) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      setError({ email: '', password: errorMsg });
    }
  };


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-500 to-gray-100 text-gray-900'} flex items-center justify-center p-6 transition-colors duration-300`}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md animate-slide-in">
        <header className="flex justify-between items-center mb-6 animate-fade-in">
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Login
          </h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-800'} hover:scale-110 transition-transform`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onInput={(e) => handleInput(e, cleanEmailInput, setEmail)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {error.email && (
                <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">{error.email}</p>
              )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onInput={(e) => handleInput(e, cleanPasswordInput, setPassword)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {error.password && (
                <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">{error.password}</p>
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center dark:text-gray-300">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;