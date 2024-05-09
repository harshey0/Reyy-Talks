import React,{useEffect , useState} from 'react';
import "./styles/app.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import List from './components/list/list';
import Chat from './components/chat/chat';
import Details from './components/details/details';
import Login from './components/auth/login';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import {onAuthStateChanged} from "firebase/auth";
import {auth , db} from "./utils/firebase.js"
import useUserStore from './utils/userState';
import useChatStore from './utils/chatState';
import { doc, updateDoc ,getDoc , onSnapshot} from "firebase/firestore";
import Call from './components/call/VideoCall';
import Vcall from './components/call/VoiceCall';
import Ringing from "./components/call/call.jsx"

function App() {

  const{currentUser, isLoading, fetchUser}=useUserStore();
  const {chatId} = useChatStore();
  const [userData, setUserData] = useState(null);

  useEffect(()=>{
    const unSub= onAuthStateChanged(auth,(user)=>{
      fetchUser(user?.uid)
      
    })
    return ()=>{unSub();
    }
  },[fetchUser] )

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.id);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setUserData(userData);
            }
          });
          return unsubscribe;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    fetchUserData();
  }, [currentUser]);

  useEffect(()=>{
    async function status()
    {if (currentUser) {
    try {
      const userRef = doc(db,"users",currentUser.id);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      if (userData.status !== "online")
      await updateDoc(userRef, { status: "online" });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }}
  status();
},[currentUser])


    if(isLoading)
    return(<div className='container' > <div className='loading'>Loading...</div>  </div>)
  return (
    <div className='container' >
<BrowserRouter>

          <Routes>

          <Route path='/' element={currentUser ? (
            <>
              {userData?.callStatus && userData.callStatus === "ringing" ? (
                <Ringing data={userData} />
              ) : (
                <></>
              )}
              <List />
              {chatId && (
                <>
                  <Chat />
                  <Details />
                </>
              )}
            </>
          ) : ( <Login/>)} />
          <Route path='/videocall/:roomId' element={<><Call/></>} />
          <Route path='/voicecall/:roomId' element={<><Vcall/></>} />
      </Routes>
        </BrowserRouter>

      <ToastContainer position='bottom-right'/>
    </div>
  );
}

export default App;
