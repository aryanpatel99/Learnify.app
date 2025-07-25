import { assets } from '../../assets/assets'
import React from 'react'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-indigo-300/70'>
      <h1 className='md:text-[48px] md:leading-[58px] text-[28px] leading-[36px] relative font-bold text-gray-800 max-w-3xl mx-auto'>Create your future with programs suited to <span className='text-blue-600'>your career choice.</span>
      <img  src={assets.sketch} alt='sketch' className='md:block hidden absolute -bottom-7 right-0'/>
    </h1>
    <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals</p>

    <p className='md:hidden text-gray-500 max-width-sm mx-auto'>We bring together world class instructors to help you achieve your personal goals.</p>

    <SearchBar/>
    </div>
  )
}

export default Hero