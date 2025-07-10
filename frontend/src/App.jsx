import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/signIn.jsx";
import SignUp from "./pages/singUp.jsx";
import Customize from "./pages/Customize.jsx";
import Home from "./pages/Home.jsx";
import { userDataContext } from "./context/userContext.jsx";
import Customize2 from "./pages/Customize2.jsx";


function App(){
  const {userData, setUserData} = useContext(userDataContext);
  return (
    <Routes>
      <Route 
        path='/' 
        element={
          (userData?.assistantImage && userData?.assistantName) 
            ? <Home /> : <Navigate to={'/customize'} />
        } 
      />
      <Route 
        path='/signup' 
        element={
          userData 
            ? <Navigate to={'/'} /> 
: <SignUp />
        } 
      />
      <Route 
        path='/signin' 
        element={
          userData 
            ? <Navigate to={'/'} /> 
            : <SignIn />
        } 
      />
      <Route 
        path='/customize' 
        element={
          userData 
            ? <Customize /> 
            : <Navigate to={'/signin'} />
        } 
      />
      <Route 
        path='/customize2' 
        element={
          userData 
            ? <Customize2 /> 
            : <Navigate to={'/signin'} />
        } 
      />
    </Routes>
 
  )
}

export default App