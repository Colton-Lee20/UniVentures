import React, { useState } from 'react';
import axios from 'axios';
import './css/input.css';

function Account() {
    const [email, setEmail] = useState('');         //EMAIL
    const [password, setPassword] = useState('');   //PASSWORD
    const [isLogin, setIsLogin] = useState(true);   //if exists login, else signup
    const [message, setMessage] = useState('');     // Success or error message
    const [error, setError] = useState(null);       // Error handling


    //ACCOUNT LOGIN/SIGNUP
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';

        // BUTTON PRESSED
        try {
            const response = await axios.post(url, {email, password});  //BACKEND REQUEST
            if (response.status==200) {                                 //HOORAY
              setMessage(response.data.message);
              setError(null);   //clear error
            }
        } catch (error) {
            setError(error.response.data.message);
            setMessage('');   //clear success
        }
    };

    return (
      <div class="flex flex-col items-center min-h-screen mt-16">
        <h2 class ='text-lg font-semibold text-center mb-4'>{isLogin ? 'Login' : 'Create Account'}</h2>
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
          {isLogin ? 'Login' : 'Sign up'}
        </button>
      </form>

      <button onClick={() => {
        setIsLogin(!isLogin);
        setError(null);
        setMessage('');
      }}
        class="text-red-400">
        {isLogin ? 'New to UniVentures? Create an account' : 'Already have an account? Login'}
      </button>

        {/* Display success message */}
        {message && <p className="success">{message}</p>}

        {/* Display error message */}
        {error && <p className="error">{error}</p>}

    </div>
    );
}

export default Account;