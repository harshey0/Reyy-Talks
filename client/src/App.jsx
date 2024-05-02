import React,{useEffect} from 'react';
import "./styles/app.css"
import List from './components/list/list';
import Chat from './components/chat/chat';
import Details from './components/details/details';
import Login from './components/auth/login';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./utils/firebase.js"
import useUserStore from './utils/userState';
import useChatStore from './utils/chatState';


function App() {

  const{currentUser, isLoading, fetchUser}=useUserStore();
  const {chatId} = useChatStore();

  useEffect(()=>{
    const unSub= onAuthStateChanged(auth,(user)=>{
      fetchUser(user?.uid)})
    return()=>{unSub();}
  },[fetchUser] )


    if(isLoading)
    return(<div className='container' > <div className='loading'>Loading...</div>  </div>)
  return (
    <div className='container' >


     {currentUser?(<> <List/>
      {chatId &&<><Chat/>
      <Details/></>}</>):( <Login/>)}
      <ToastContainer position='bottom-right'/>
    </div>
  );
}

export default App;
