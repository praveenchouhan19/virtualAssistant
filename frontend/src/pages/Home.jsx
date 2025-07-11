import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from '../assets/ai.png'
import userImg from '../assets/user.gif'
import { HiMenuAlt3 } from "react-icons/hi";
import { ImCross } from "react-icons/im";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")

  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error);
      }
    }
  };


  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }


    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      startRecognition();
    }


    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'youtube-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if (type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/watch?v=${query}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open('https://www.calculator.com', '_blank');
    }
    if (type === 'instagram-open') {
      window.open('https://www.instagram.com', '_blank');
    }
    if (type === 'facebook-open') {
      window.open('https://www.facebook.com', '_blank');
    }
    if (type === 'weather-show') {
      window.open(`https://www.weather.com/weather/today/l/${userInput}`, '_blank');
    }

  };




  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition; 
    

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setListening(true);
      isRecognizingRef.current = true;
    };


    recognition.onend = () => {
      console.log("Speech recognition ended");  
      setListening(false);
      isRecognizingRef.current = false;
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      isRecognizingRef.current = false;
      if (event.error === 'aborted' || !isRecognizingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }
        , 1000);
      }
    };



    recognition.onresult =  async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard: " + transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        setAiText("");
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        console.log("Gemini response:", data);
        handleCommand(data)
        setUserText("");
        setAiText(data.response);
      }

    };
    const fallback = setInterval(() => {
      if (!isRecognizingRef.current && !isSpeakingRef.current) {
        safeRecognition();
      }
    },1000);
    safeRecognition();
    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    }
    
  }, []);

   




  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[50px]">
      
      <HiMenuAlt3 className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' />
      <div className='absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] item-start'>
        <ImCross className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' />
        <button
          className="min-w-[150px] h-[60px]  text-black font-semibold  bg-white rounded-full text-[19px] cursor-pointer"
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className="min-w-[150px] h-[60px]  text-black font-semibold bg-white top-[100px] right-[20px] rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        
      </div>


      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full text-[19px] cursor-pointer"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[100px] right-[20px] rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img src={userData?.assistantImage} alt="" className="h-full object-cover" />
      </div>
      <h1>I'm {userData?.assistantName}</h1>
       {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>

    
    </div>
  )
}

export default Home
