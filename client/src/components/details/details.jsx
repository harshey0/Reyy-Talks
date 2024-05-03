import React , {useState, useEffect} from 'react'
import "../../styles/details.css"
import arrowd from "../../assets/arrowDown.png";
import download from "../../assets/download.png";
import { auth,db } from '../../utils/firebase';
import { toast } from 'react-toastify';
import useChatStore from '../../utils/chatState';
import useUserStore from '../../utils/userState';
import { doc, updateDoc , onSnapshot} from "firebase/firestore";

export default function Details() {

  const {chatId , user } = useChatStore();
  const {currentUser} = useUserStore();
const [chat , setChat] = useState()

useEffect(() => {
  const unSub = onSnapshot(doc(db,"chats",chatId),
  (res)=>{
    setChat(res.data())
  })
  return()=>{
    unSub();
  }
}, [chatId]);

async function logout()
{
  try {
    const userRef = doc(db,"users",currentUser.id);
    await updateDoc(userRef, { status: "offline" });
  auth.signOut(); 
  toast.success("Logged out successfully")
  } catch (error) {
    console.error("Error updating user status:", error);
  }
}


  return (
    <div className='details'>
    <div className="user">
      <img src={user.dp} alt="" />
      <h2>{user.username}</h2>
      {/* <p> {bio}  </p> */}
    </div>
    <div className="info">
      <div className="option">
        <div className="title">
         <span> Shared photos </span>
         <img src={arrowd} alt="" />
         </div>
         <div className="photos">
      
        {chat?.messages.map((item)=>  { return item.img &&( <div className="photoItem">
           
           <div className="mainphoto"> <img src={item.img} alt="" />
             <span>{item.senderId === currentUser.id? "Sent":"Recieved"}</span></div>
           {/* <img src={download} alt="" /> */}
 
           </div>);})}
       
         </div>
    </div>
    
    </div>

    <button onClick={ ()=>{}}>BLOCK USER</button>
    <button className='btn' onClick={ ()=>{logout()}}>LOG OUT</button>
    </div>
  )
}
