import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = 'http://localhost:5001/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username || !email || !password) {
      setError('All feilds are mandatory!')
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/users/register`, { username, email, password });
      setError('');
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }


  return (
    <div className="container max-w-7xl flex items-center justify-center bg-gray-100 mx-auto min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
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
            Sign Up
          </button>
        </div>
          <p className="mt-4 text-center">
            Already have an account <Link to="/login" className="text-blue-500">Login</Link>
          </p>

      </div>
    </div>
  )
}

export default Signup