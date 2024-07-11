// src/SignUpForm.js
import React, { useState } from "react";
import './SignUpForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';


const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            // const csrftoken = getCookie('csrftoken'); //new
            const response = await axios.post('http://127.0.0.1:8000/authentication/signup/', {
                username,
                email,
                password
            },
            );

            axios.post('http://127.0.0.1:8000/authentication/signup2/', {
                username,
                email
            },
            );
            
            console.log('Sign-up successful:', response.data);
            window.location.href = '/'
            // Handle successful sign-up, e.g., redirect to login page
        } catch (error) {
            alert("Sign-up not successful");
            console.error('Error signing up:', error);
            // Handle sign-up error
        }
    };
    

    return (
        <div className="wrapperr">
        <div className="wrapper">
            <form onSubmit={handleSignUp}>
                <h1>Sign Up</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>
                <button type="submit">Sign Up</button>
                <div className="form-link">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
        </div>
    );
};

export default SignUpForm;
