import React, { useContext } from 'react';
import { userDataContext } from '../context/userContext';

function Card({ image }) {
    const {serverUrl,
        userData,setUserData,
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage }= useContext(userDataContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#0000ff66] border-3 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
     ${selectedImage==image?"border-4 border-red-800 shadow-3xl shadow-blue-950":null}`} onClick={() => {setSelectedImage(image)
        setBackendImage(null) //new
        setFrontendImage(null) //new
     }}>
      <img src={image} className='h-full object-cover' />
    </div>
  )
}
export default Card;