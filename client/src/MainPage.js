import React from 'react';
import './css/input.css';
import Banner from './Banner';
import SearchBar from './Search';



function MainPage() {
    return (
    <div className="bg-[#ffffff] dark:bg-gray-800 w-screen h-screen overflow-hidden">
        <Banner/>

        <SearchBar/> 

    </div>
    );
}
export default MainPage;