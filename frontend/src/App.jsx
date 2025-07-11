import{ useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SingUp.jsx";
import Customize from "./pages/Customize.jsx";
import Home from "./pages/Home.jsx";
import { userDataContext } from "./context/userContext.jsx";
import Customize2 from "./pages/Customize2.jsx";


function App(){
  const {userData, setUserData, isLoading} = useContext(userDataContext);
  
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
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
            : <Navigate to={'/signup'} />
        } 
      />
      <Route 
        path='/customize2' 
        element={
          userData 
            ? <Customize2 /> 
            : <Navigate to={'/signup'} />
        } 
      />
    </Routes>
  )
}

export default App