// src/LoginForm.js
import React, { useState,useRef,useContext } from "react";
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from "../AuthContext"; // Import useAuth hook
import handlLog from '../App.js'
import { useCookies } from "react-cookie";

const LoginForm = ({handlLog}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const recaptchaRef = useRef();
    const [captchaValue, setCaptchaValue] = useState(null);
    //const {authenticatedUser,setUsrr} = useContext(AuthContext);
    const [cookies, setCookie] = useCookies(['user'])
    // const [authenticatedUser, setAuthenticatedUser] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = captchaValue;
            const response = await axios.post('http://127.0.0.1:8000/authentication/login/', {
                username,
                password,
                token: token
            }); 
            
            if(response.status === 200){
                handlLog(username);
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.log(error)
            if(error.response.status === 400){
                alert("CAPTCHA verification failed.")
            }
            else if(error.response.status === 401){
                alert("Invalid credentials.")
            }
            else if(error.response.status === 405){
                alert("Method not allowed.")
            }
            else {
                alert(error.response.status);
            }
            console.error('Error logging in:', error);
            // Handle login error
        }
    };

    return (
        <div className="wrapperr">
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>
                <ReCAPTCHA 
                    ref={recaptchaRef}
                    sitekey="6LfMRQMqAAAAAMyozFP5Srn_OZ3-Iz40QXMjjchq"
                    onChange={(value) => setCaptchaValue(value)}
                />
                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Remember Me
                    </label>
                    <a href="wwww.youtube.com">Forgot Password?</a>
                </div>
                <button type="submit">Login</button>
                <div className="form-link">
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;
