import React from 'react';
import './css/input.css';
import Banner from './Banner';

function About() {
    return (
    <div className="bg-[#ffffff] dark:bg-gray-800 w-screen h-screen overflow-hidden">
        <Banner/>
        <div>
            About page!
        </div>
    </div>
    );
}
export default About;