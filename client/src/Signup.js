import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './css/input.css';
import Banner from './Banner';

function Signup() {
    const [email, setEmail] = useState('');         //EMAIL
    const [password, setPassword] = useState('');   //PASSWORD
    const [message, setMessage] = useState('');     // Success or error message
    const [error, setError] = useState(null);       // Error handling
    const [loading, setLoading] = useState(true);           // Don't load until cookie checked
    const [isLoggedIn, setIsLoggedIn] = useState(false);    // Logged in boolean
    

    //CHECK IF USER IS LOGGED IN
    useEffect(() => {
      const checkLoginStatus = async () => {
          try {

              const response = await axios.get('http://localhost:5000/api/auth/check-login', {
                  withCredentials: true //cookie with request
              });

              if (response.data.isLoggedIn) {   //COOKIE EXISTS
                setIsLoggedIn(true);
              }

          } catch (error) {
              //Cookie does not exist.
          } finally {
            setLoading(false); // Done checking for cookie
          }
      };
      checkLoginStatus();
    }, []); 



    //EMAIL VALIDATION SETUP
    const validateEmail = (email) => {
      const eduEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[eE][dD][uU]$/;
      return eduEmailPattern.test(email);
    };

    //PASSWORD VALIDATION SETUP
    const validatePassword = (password) => {
      const rules = [
          { label: '8 characters', isValid: password.length >= 8 },
          { label: '1 digit', isValid: /\d/.test(password) },
          { label: '1 uppercase letter', isValid: /[A-Z]/.test(password) },
          { label: '1 special character', isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
      ];
      return rules;
  };


    //ACCOUNT SIGNUP 
    const handleSubmit = async (e) => {
        e.preventDefault();

        //check input requirements
        if (!validateEmail(email)) {
          setError("Please enter a valid .edu email address");
          return;
        }

        const passwordRules = validatePassword(password);
        const invalidRules = passwordRules.filter(rule => !rule.isValid);

        //display broken rules
        if (invalidRules.length > 0) {
            const unmetRequirements = invalidRules.map(rule => rule.label).join(', ');
            setMessage(`Password must include:`);
            setError(unmetRequirements);
            return;
        }




        const url = 'http://localhost:5000/api/auth/signup';

        // BUTTON PRESSED
        try {
            const response = await axios.post(url, {email, password}, {withCredentials: true});  //BACKEND REQUEST
                                                                     //withCredentials accepts cookies

            if (response.status===201) {                                 //HOORAY
              window.location.href = '/account';
            }
        } catch (error) {                                               //aw man
            setError(error.response.data.message);
            setMessage('');   //clear success
        }
    };


    // DONT MOVE DOWN - need to check if cookie exists
    if (loading) {
      return <div className='bg-[#101c26] w-screen min-h-screen'><div><Banner/></div></div>;  // Could just put navbar here
    }

    // COOKIE EXISTS - navigate to account page
    if (isLoggedIn) {
      return <Navigate to="/account" replace />;
    }

    // COOKIE DOES NOT EXIST - render sign up page
    return (
        <div className='bg-[#101c26] min-h-screen overflow-auto'>
          <Banner/>
            <section className='py-2'>
                <div className='max-w-lg mx-auto p-4 md:p-16 xl:p-20'>
                    <div className='lg:w-2/3 space-y-5 text-center mx-auto'>
                        <h1 className='text-white uppercase tracking-wides font-medium text-4xl cursor-default'>
                            Create an account
                        </h1>
                        <div className='h-0.5 bg-red-500 w-14 mx-auto'></div>
                    </div>
                    <div className='flex justify-center'>
                      <div className='grid grid-cols-1 gap-6 mt-10'>
                          <div className='lg:col-span-4'>
                            <div className='flex flex-col items-center'>
                              <form onSubmit={handleSubmit}>
                                <div class="flex items-center space-x-9 mb-4">
                                  <label class = 'text-white'>Email:</label>
                                  <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {              //set var and clear messages
                                      setEmail(e.target.value);
                                      setMessage('');
                                      setError(null);
                                    }}
                                    required
                                    class='border text-gray-900 w-60 text-sm rounded focus:ring-0 focus:border-gray-400 block p-2 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-white'
                                  />
                                </div>
                                <div class="flex items-center space-x-2 mb-4">
                                  <label class = 'text-white'>Password:</label>
                                  <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {              //set var and clear messages
                                      setPassword(e.target.value);
                                      setMessage('');
                                      setError(null);
                                    }}
                                    required
                                    class=" border rounded mb-2 w-60 border text-gray-900 text-sm rounded focus:ring-0 focus:border-gray-400 block p-2 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-white"
                                  />
                                </div>
                                <div className='flex justify-end w-full'>
                                <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-auto">
                                  Sign up
                                </button>
                                </div>
                              </form>
                              </div>
                              <div className="flex flex-col items-center justify-center text-center">
                              <div className="min-w-[800px]">
                                {<p className="success font-bold text-white mt-4 mb-3 h-3">{message}</p>}
                                {<p className="error font-bold text-red-500 h-3">{error}</p>}
                              </div>
                              <span className="cursor-default text-white mt-16">
                                Already have an account? <a href="/login" className="text-red-400">Login</a>
                              </span>
                            </div>
                          </div>
                      </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Signup;