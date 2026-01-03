import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav>
            <div className="container nav-content">
                <Link to="/" className="logo">LUCKYSTRIKE</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/">Dashboard</Link>
                            <Link to="/favorites">Favorites</Link>
                            <span>Hi, {user.name}</span>
                            <button onClick={logout} style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register"><button className="btn-primary">Register</button></Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
