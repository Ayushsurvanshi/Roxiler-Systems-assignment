import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import App.css for general styles
import { useAuth } from '../context/AuthContext'; // Import useAuth
import api from '../utils/api'; // Import the api utility

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Get setToken from AuthContext

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Login onSubmit triggered.');
        
        try {
            console.log('Before API call for login with:', { email, password });
            const res = await api.post('/auth/login', { email, password });
            console.log('Login successful! Backend response:', res.data);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token); // Update token in AuthContext
            setMessage('Login successful!');
            const userRole = res.data.user.role;
            // Navigation logic re-enabled
            if (userRole === 'System Administrator') {
                navigate('/admin');
            } else if (userRole === 'Normal User') {
                navigate('/user/stores');
            } else if (userRole === 'Store Owner') {
                navigate('/owner/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login API call failed:', err);
            setMessage(err.response?.data?.msg || err.message || 'Login failed');
        } finally {
            console.log('Login onSubmit function finished.');
        }
    };

    return (
        <div className="container small-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                    placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            {message && <p className={message.includes('successful') ? 'alert alert-success' : 'alert alert-danger'}>{message}</p>}
        </div>
    );
};

export default Login;
