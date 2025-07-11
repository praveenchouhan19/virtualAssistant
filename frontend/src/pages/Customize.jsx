import React, { use, useContext, useRef, useState } from 'react';
import Card from '../components/Cards.jsx';
import { FaRegFileImage } from "react-icons/fa6";
import { userDataContext } from '../context/userContext.jsx';
import { IoMdArrowBack } from "react-icons/io";

import image1 from '../assets/image1.avif';
import image2 from '../assets/image2.avif';
import image3 from '../assets/image3.webp';
import image4 from '../assets/image4.avif';
import image5 from '../assets/image5.webp';
import image6 from '../assets/image6.jpg';
import image7 from '../assets/image7.jpg';
import { set } from 'mongoose';
import { useNavigate } from 'react-router-dom';


function Customize() {
    const inputImage = useRef(null);
    const {serverUrl,
    userData,setUserData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage }= useContext(userDataContext);
    const navigate = useNavigate();

    const handleImage = () => (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]'>
    <IoMdArrowBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
          onClick={()=>navigate("/")}/>
    <h1 className='text-white mb-[20px] text-[30px] text-center'>Customize your <span className='text-blue-400'>Virtual Assistant</span>
    </h1>
      <div className='w-full max-w-[900px] flex flex-wrap justify-center items-center gap-[15px]'>
        <Card image={image1}/>
        <Card image={image2}/>
        <Card image={image3}/>  
        <Card image={image4}/>
        <Card image={image5}/>
        <Card image={image6}/>
        <Card image={image7}/>

        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#0000ff66] border-3 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center  ${selectedImage=="input"?"border-4 border-red-800 shadow-3xl shadow-blue-950":null}`} 
        onClick={()=>{
            inputImage.current.click()
            setSelectedImage("input");}}>
            {!frontendImage && <FaRegFileImage className='w-[25px] h-[25px] text-white cursor-pointer'/>}
            {frontendImage && <img  src={frontendImage} className='h-full object-cover' />}
        </div>
        <input type="file" accept='image/*' className='hidden' ref={inputImage} 
          onChange={handleImage()} />
      </div>

      {selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer" onClick={() => navigate("/Customize2")} >
            Next
        </button> }
       
    </div>
  );
}

export default Customize;
