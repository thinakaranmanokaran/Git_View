import React from 'react'
import images from './assets/images'
import { VscGithubAlt } from "react-icons/vsc";
import { TfiInstagram } from "react-icons/tfi";
import { PiChatTeardropTextLight, PiChatTeardropTextThin } from "react-icons/pi";
import { HiArrowUpRight } from "react-icons/hi2";
import confetti from "canvas-confetti";

const App = () => {

    const handleConfetti = () => {
        // Fire confetti from the left
        confetti({
            particleCount: 100,
            spread: 60,
            startVelocity: 50,
            origin: { x: 0, y: 1 }, // Random Y position (0.2 to 0.8)
        });

        // Fire confetti from the right after a slight delay
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 60,
                startVelocity: 50,
                origin: { x: 1, y: 1 }, // Random Y position (0.2 to 0.8)
            });
        }); // 200ms delay for a natural effect
    };

    const handleClick = (e) => {
        handleConfetti(); // Your confetti function
        e.target.blur(); // Removes focus after clicking
      };

    return (
        <div className=' text-4xl font-sansheavy text-white bg-dark h-screen w-screen ' >
            <div className=' flex flex-col space-y-6 pt-32  w-full h-full items-center' >
                <div>
                    <img src={images.Logo} className=' w-32 bg-white  rounded-full ' alt="" srcset="" />
                </div>
                <div className='flex  space-x-4' >
                    <h1 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent'>Vite (ReactJS)</h1>
                    <h1>+</h1>
                    <h1 className='bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>Tailwind CSS </h1>
                </div>
                <div>
                    <button className='font-mono text-sm border-[1px] border-white px-6 py-3 shadow-[3px_3px_0px_white] before:absolute before:bg-white  before:h-10 before:w-30 before:-rotate-45 before:left-[-100%] relative hover:before:left-[100%] transition-all duration-300 before:transition-all before:duration-500 before:hover:left-[100%] overflow-hidden cursor-pointer  hover:scale-110 focus:shadow-none focus:translate-x-1.5 focus:translate-y-1.5 ' onClick={handleClick} >🎊 Celebrate 🎊</button>
                </div>
                <div className='bottom-10 absolute flex flex-col items-center space-y-3' >
                    <div className='text-xl font-sansnormal flex space-x-2 ' >
                        <div className=' text-white opacity-60 ' >Author :</div>
                        <a href="https://thinakaranmanokaran.netlify.app" target="_blank" rel="noopener noreferrer" className=' before:absolute before:bg-white before:h-[1px] before:w-full relative before:left-[-105%] hover:before:left-[0%] before:transition-all before:duration-300 overflow-x-hidden before:bottom-0.5 pb-1 flex space-x-1 items-center group pr-2  ' ><span>Thinakaran Manokaran</span><HiArrowUpRight className=' group-hover:rotate-45 transition-all duration-300 group-hover:translate-x-1 text-lg' /></a>
                    </div>
                    <div className='flex space-x-4 text-2xl items-end' >
                        <a href="https://github.com/thinakaranmanokaran" target="_blank" rel="noopener noreferrer"><VscGithubAlt /></a>
                        <a href="https://www.instagram.com/thinakaranmanokaran/" target="_blank" rel="noopener noreferrer"><TfiInstagram /></a>
                        <a href="https://thinakaranmanokaran.netlify.app" target="_blank" rel="noopener noreferrer"><PiChatTeardropTextLight className='text-3xl -mb-0.5' /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App