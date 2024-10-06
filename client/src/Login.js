import React, { useState } from 'react';
import axios from 'axios';
import './css/input.css';

function Login() {
    const [email, setEmail] = useState('');         //EMAIL
    const [password, setPassword] = useState('');   //PASSWORD
    const [message, setMessage] = useState('');     // Success or error message
    const [error, setError] = useState(null);       // Error handling

    //ACCOUNT LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://localhost:5000/api/auth/login';

        // BUTTON PRESSED
        try {
            const response = await axios.post(url, {email, password}, { withCredentials: true });  //BACKEND REQUEST
                                                                      //withCredentials accepts cookies
            if (response.status===200) {
              window.location.href = '/account';
            }
        } catch (error) {
            setError(error.response.data.message);
            setMessage('');   //clear success
        }
    };

    return (
      <div class="flex flex-col items-center min-h-screen mt-16">
        <h2 class ='text-lg font-semibold text-center mb-4 cursor-default'>Login</h2>
         <form onSubmit={handleSubmit}>
          <div class="flex items-center space-x-9">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {              //set var and clear messages
                setEmail(e.target.value);
                setMessage('');
                setError(null);
              }}
              required
              class="flex-grow border rounded px-5 mb-1"
            />
          </div>
          <div class="space-x-2">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {              //set var and clear messages
                setPassword(e.target.value);
                setMessage('');
                setError(null);
              }}
              required
              class="flex-grow border rounded px-5 mb-1"
            />
        </div>
        
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mb-5">
          Login
        </button>
      </form>

      <span class="cursor-default">New to UniVentures? <a href="/signup" class="text-red-400">Create an account</a></span>

        {/* Display success message */}
        {message && <p className="success font-bold">{message}</p>}

        {/* Display error message */}
        {error && <p className="error font-bold">{error}</p>}
    </div>
    );
}

export default Login;