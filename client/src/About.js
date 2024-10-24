import React from 'react';
import './css/input.css';
import Banner from './Banner';
import background from './Images/About-Background.jpg'

function About() {
    return (
    <div className='w-screen h-screen bg-cover bg-center' style={{ backgroundImage: `url(${background})` }}>
        <Banner/>
            <div className='flex flex-col items-center mt-40 mx-40 px-10 py-10 rounded-2xl  bg-[#101c26]'>
                <div className='text-white font-serif text-5xl mb-4'>UniVentures</div>
                <h2 className='text-white text-center'>
                Univentures is your go-to web app for discovering exciting things to do around 
                your college campus! Whether you're looking for a new place to eat, explore, or 
                socialize, Univentures helps you find nearby adventures tailored to your university 
                experience. Users can discover recommended spots added by others or browse locations 
                via Google’s Places API. You can rate, review, and even create your own adventures—after 
                verifying your university email. For those feeling spontaneous, the “Surprise Me!” feature 
                picks a random adventure for you. No account? No problem! You can still explore, but creating 
                and reviewing adventures requires one. Plan your next adventure with Univentures!
                </h2>
            </div>
    </div>
    );
}
export default About;