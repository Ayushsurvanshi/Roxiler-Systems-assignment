import React from 'react';
import {
    Link,
    NavLink, // Using NavLink for active state
    Route,
    Routes
} from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminStores from './pages/AdminStores';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home'; // Import the new Home component
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import Register from './pages/Register';
import StoreList from './pages/StoreList';

function App() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState(''); // State for search input

  const handleLogout = () => {
    logout();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Implement actual search logic here, maybe redirect to a search results page
    console.log('Search Term:', e.target.value);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-store brand-icon"></i> Store Rater
          </Link> {/* Added brand icon */}
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            {!user && <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>}
            {!user && <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>}
            {user && user.role === 'System Administrator' && <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Admin</NavLink>}
            {user && user.role === 'Normal User' && <NavLink to="/user/stores" className={({ isActive }) => (isActive ? 'active' : '')}>Stores</NavLink>}
            {user && user.role === 'Store Owner' && <NavLink to="/owner/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Owner</NavLink>}
          </div>
        </div>
        <div className="navbar-user-info">
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          /> {/* Search input */}
          {user && (
            <>
              <span>Welcome, {user.role === 'System Administrator' ? 'Admin' : user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute roles={['System Administrator']}> <AdminDashboard /> </PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['System Administrator']}> <AdminUsers /> </PrivateRoute>} />
        <Route path="/admin/stores" element={<PrivateRoute roles={['System Administrator']}> <AdminStores /> </PrivateRoute>} />
        {/* Normal User Routes */}
        <Route path="/user/stores" element={<PrivateRoute roles={['Normal User']}> <StoreList /> </PrivateRoute>} />
        {/* Store Owner Routes */}
        <Route path="/owner/dashboard" element={<PrivateRoute roles={['Store Owner']}> <OwnerDashboard /> </PrivateRoute>} />
      </Routes>
      <footer className="footer">
        <p>Store Rater &copy; 2025. All rights reserved.</p>
        <p>Built with ❤️ for a better rating experience.</p>
        {/* Add social media icons or quick links here if desired */}
      </footer>
    </div>
  );
}

export default App;
