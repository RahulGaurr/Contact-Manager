import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [editingContact, setEditingContact] = useState(null); // { id, name, email, phone } or null
  const [username, setUsername] = useState(''); // Store logged-in username
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {

    // Decode username from token to display beside logout button
    if (user?.token) {
      try {
        const decoded = jwtDecode(user.token);
        setUsername(decoded.user?.username || '');
      } catch (err) {
        setUsername('');
      }
    }
    // or fetch username from /api/users/current endpoint
        // const userResponse = await axios.get(`${API_URL}/users/current`, {
        //   headers: { Authorization: `Bearer ${user.token}` },
        // });
        // setUsername(userResponse.data.username || '');

    // Fetch contacts
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${API_URL}/contacts`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setContacts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contacts');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchContacts();
  }, [user, navigate, logout]);

  // Create contact
  const handleCreateContact = async () => {
    if (!name || !email || !phone) {
      setError('All fields are mandatory');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/contacts`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContacts([...contacts, response.data]);
      setName('');
      setEmail('');
      setPhone('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contact');
    }
  };

  // Toggle edit mode or save contact
  const handleEditContact = async (contact) => {
    if (editingContact && editingContact.id === contact._id) {
      // Save changes
      if (!editingContact.name || !editingContact.email || !editingContact.phone) {
        setError('All fields are mandatory');
        return;
      }
      try {
        const response = await axios.put(
          `${API_URL}/contacts/${contact._id}`,
          editingContact,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setContacts(contacts.map((c) => (c._id === contact._id ? response.data : c)));
        setEditingContact(null);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update contact');
      }
    } else {
      // Start editing
      setEditingContact({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
      setError('');
    }
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
      if (editingContact && editingContact.id === id) {
        setEditingContact(null);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  // Update editing contact fields
  const handleEditChange = (field, value) => {
    setEditingContact({ ...editingContact, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Contact Manager</h2>
          <div className="flex items-center gap-4">
            {username && <span className="text-lg text-gray-700">Logged in as: {username}</span>}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Create Contact</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Contact Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleCreateContact}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Contact
            </button>
          </div>
        </div>
        <p className="text-lg font-semibold mb-4">
          Total Contacts: {contacts.length}
        </p>
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="bg-white p-4 rounded-lg shadow-md">
              {editingContact && editingContact.id === contact._id ? (
                <>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={editingContact.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={editingContact.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={editingContact.phone}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                </>
              ) : (
                <>
                  <p className="w-full p-2 mb-2 text-gray-700">{contact.name}</p>
                  <p className="w-full p-2 mb-2 text-gray-700">{contact.email}</p>
                  <p className="w-full p-2 mb-2 text-gray-700">{contact.phone}</p>
                </>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditContact(contact)}
                  className={`px-4 py-2 rounded-md text-white ${
                    editingContact && editingContact.id === contact._id
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {editingContact && editingContact.id === contact._id ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;