import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";


function Customize2() {
    const navigate = useNavigate();
    const {userData, backendImage, selectedImage,
    setUserData, serverUrl } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");

    const handleUpdateAssistant = async () => {
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(
            `${serverUrl}/api/user/update`,
            formData,
            { withCredentials: true }
            );
            setUserData(result.data);
            console.log("Assistant updated successfully:", result.data);
        } catch (error) {
           console.log("Error updating assistant:", error.response?.data || error.message);
        }
    };


  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]">
      <h1 className='text-white mb-[20px] text-[30px] text-center'>Enter your <span className='text-blue-400'>Assistant Name</span>
    </h1>
    <input 
        type="text" 
        placeholder="eg: Jarvis, Friday, etc." 
        className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' 
        required onChange={(e) => setAssistantName(e.target.value)} value={assistantName}
        />
    { assistantName && <button className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer"   
    onClick={() => {
        handleUpdateAssistant()
    }} >
        Finally Create Your Assistant
    </button> }
    </div>
  )
}
export default Customize2;