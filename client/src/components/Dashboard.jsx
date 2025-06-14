import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { cleanUsernameInput, validateUsername, cleanEmailInput, validateEmail, cleanPhoneInput, validatePhone, isFunctionalKey } from '../utils/validators';

const API_URL =
  import.meta.env.VITEDEV_API_URL ||
  "https://contact-manager-87bf.onrender.com/api" ||
  "http://localhost:5001";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({ name: "", email: "", phone: "" });
  const [success, setSuccess] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(user.token);
      setUsername(decoded.user?.username || "");
    } catch (err) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/contacts`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setContacts(response.data);
      } catch (err) {
        setError({ name: '', email: '', phone: err.response?.data?.message || 'Failed to fetch contacts' });
        if (err.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user, navigate, logout]);

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error.name || error.email || error.phone || success) {
      const timer = setTimeout(() => {
        setError({});
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Process contacts: search → filter → sort
  const processedContacts = contacts
    .filter((contact) =>
      debouncedSearchQuery
        ? contact.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          contact.email
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          contact.phone
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        : true
    )
    .filter((contact) => {
      switch (filterType) {
        case "gmail":
          return contact.email.toLowerCase().endsWith("@gmail.com");
        case "hasPhone":
          return contact.phone && contact.phone.trim() !== "";
        case "noPhone":
          return !contact.phone || contact.phone.trim() === "";
        case "all":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const fieldA = a[sortField]?.toLowerCase() || "";
      const fieldB = b[sortField]?.toLowerCase() || "";
      const order = sortOrder === "asc" ? 1 : -1;
      return fieldA < fieldB ? -order : fieldA > fieldB ? order : 0;
    });

   const handleInput = (e, cleaner, setter) => {
    const cleanedValue = cleaner(e.target.value);
    setter(cleanedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' && !isFunctionalKey(e.key)) {
      e.preventDefault();
      const field = e.target.name;
      setError({ ...error, [field]: 'Spaces are not allowed' });
    }
  };


  const handleCreateContact = async () => {
    const newError = {
      name: validateUsername(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
    };
    if (newError.name || newError.email || newError.phone) {
      setError(newError);
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
      setSuccess('Contact added successfully!');
    } catch (err) {
      let errorMsg = 'Failed to create contact';
      try {
        const parsedError = JSON.parse(err.response?.data?.message || '{}');
        errorMsg = parsedError.name || parsedError.email || parsedError.phone || err.response?.data?.message || errorMsg;
      } catch (parseErr) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      setError({ name: '', email: '', phone: errorMsg });
    }
  };

  const handleEditContact = async (contact) => {
    if (editingContact && editingContact.id === contact._id) {
      const newError = {
        name: validateUsername(editingContact.name),
        email: validateEmail(editingContact.email),
        phone: validatePhone(editingContact.phone),
      };
      if (newError.name || newError.email || newError.phone) {
        setError(newError);
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
        setSuccess('Contact updated successfully!');
      } catch (err) {
        let errorMsg = 'Failed to update contact';
        try {
          const parsedError = JSON.parse(err.response?.data?.message || '{}');
          errorMsg = parsedError.name || parsedError.email || parsedError.phone || err.response?.data?.message || errorMsg;
        } catch (parseErr) {
          errorMsg = err.response?.data?.message || errorMsg;
        }
        setError({ name: '', email: '', phone: errorMsg });
      }
    } else {
      setEditingContact({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
      if (editingContact && editingContact.id === id) {
        setEditingContact(null);
      }
      setSuccess('Contact deleted successfully!');
    } catch (err) {
      setError({ name: '', email: '', phone: err.response?.data?.message || 'Failed to delete contact' });
    }
  };



  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-500 to-gray-100 text-gray-900"
      } p-6 transition-colors duration-300`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 animate-fade-in ">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Contact Manager
          </h1>
          <div className="flex items-center gap-4">
            {username && (
              <span
                className={`text-xl font-bold ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {username}
              </span>
            )}
            <button
              onClick={toggleDarkMode}
              className={` p-1 rounded-full  transition duration-300 transform hover:scale-110 hover:shadow-xl ${
                isDarkMode ? "bg-gray-800" : "bg-blue-800"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-xl transition duration-300 transform hover:scale-110 hover:shadow-xl"
            >
              <div className="rounded-full">
                <img
                  src={isDarkMode ? "/logout_dark.png" : "/plogo.png"}
                  className="w-6"
                  alt="Logout"
                />
              </div>
            </button>
          </div>
        </header>

        {/* Success messages */}
        {success && (
          <div className="p-4 rounded-lg mb-6 animate-slide-in bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {/* Create Contact Form */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 animate-slide-in">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Add New Contact
          </h2>
          <div className="grid gap-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                 onInput={(e) => handleInput(e, cleanUsernameInput, setName)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {error.name && (
                <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">
                  {error.name}
                </p>
              )}
            </div>
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
                <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">
                  {error.email}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                 onInput={(e) => handleInput(e, cleanPhoneInput, setPhone)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {error.phone && (
                <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">
                  {error.phone}
                </p>
              )}
            </div>
            <button
              onClick={handleCreateContact}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all"
            >
              Add Contact
            </button>
          </div>
        </section>

        {/* Controls: Search, Sort, Filter */}
        <section className="sticky top-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-8 animate-slide-in flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <select
            value={`${sortField}:${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(":");
              setSortField(field);
              setSortOrder(order);
            }}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="email:asc">Email (A-Z)</option>
            <option value="email:desc">Email (Z-A)</option>
            <option value="phone:asc">Phone (A-Z)</option>
            <option value="phone:desc">Phone (Z-A)</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="all">All Contacts</option>
            <option value="gmail">Gmail Emails</option>
            <option value="hasPhone">Has Phone</option>
            <option value="noPhone">No Phone</option>
          </select>
        </section>

        {/* Contact List */}
        <section>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Total Contacts: {processedContacts.length}
          </h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 dark:text-gray-300">Loading contacts...</p>
            </div>
          ) : processedContacts.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              No contacts found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processedContacts.map((contact, index) => (
                <div
                  key={contact._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {editingContact && editingContact.id === contact._id ? (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Name"
                          value={editingContact.name}
                         onInput={(e) => handleInput(e, cleanUsernameInput, (value) => setEditingContact({ ...editingContact, name: value }))}
                          onKeyDown={handleKeyDown}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                         {error.name && (
                          <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">{error.name}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={editingContact.email}
                          onInput={(e) => handleInput(e, cleanEmailInput, (value) => setEditingContact({ ...editingContact, email: value }))}
                          onKeyDown={handleKeyDown}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        {error.email && (
                          <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">{error.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Phone"
                          value={editingContact.phone}
                          onInput={(e) => handleInput(e, cleanPhoneInput, (value) => setEditingContact({ ...editingContact, phone: value }))}
                          onKeyDown={handleKeyDown}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        {error.phone && (
                          <p className="text-red-700 dark:text-red-400 text-sm mt-1 animate-slide-in">{error.phone}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold dark:text-gray-100">
                        {contact.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contact.phone || "No phone"}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className={`flex-1 px-4 py-2 rounded-lg text-white transition-all hover:scale-105 ${
                        editingContact && editingContact.id === contact._id
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {editingContact && editingContact.id === contact._id
                        ? "💾 Save"
                        : "✏️ Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
