import { useState,useContext } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from "../contexts/AuthContext"

const API_URL = import.meta.env.VITEDEV_API_URL || 'https://contact-manager-87bf.onrender.com/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login} =  useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      setError('All feilds are mandatory!')
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/users/login`, {email, password});
      login(response.data.accessToken);
      setError('')
    } catch (err) { 
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container max-w-7xl mx-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
          <p className="mt-4 text-center">Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link>
          </p>
          
      </div>
    </div>
  );
}

export default Login