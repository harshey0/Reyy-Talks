import React , {useState, useEffect} from 'react'
import "../../styles/details.css"
import arrowd from "../../assets/arrowDown.png";
// import download from "../../assets/download.png";
import { auth,db } from '../../utils/firebase';
import { toast } from 'react-toastify';
import useChatStore from '../../utils/chatState';
import useUserStore from '../../utils/userState';
import { doc, updateDoc , onSnapshot , arrayUnion , arrayRemove } from "firebase/firestore";

export default function Details() {

  const {chatId , user , changeBlock } = useChatStore();
  const {currentUser} = useUserStore();
const [chat , setChat] = useState()
const [isCurrentBlocked, setc ] = useState(false);
const [isRecieveBlocked, setr ] = useState(false);


useEffect(() => {
  const unSub = onSnapshot(doc(db,"chats",chatId),
  (res)=>{
    setChat(res.data())
  })
  return()=>{
    unSub();
  }
}, [chatId]);

useEffect(() => {
  const unSub = onSnapshot(doc(db,"users",currentUser.id),
  (res)=>{
    if (res.data().blocked.includes(user.id))
    setr(true);
    else
    setr(false);
  })
  const unSub1 = onSnapshot(doc(db,"users",user.id),
  (res)=>{
    if(res.data().blocked.includes(currentUser.id))
    setc(true);
    else
    setc(false);
  })
  return()=>{
    unSub();
    unSub1();
  }
});

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
async function block()
{
  try {
    const userRef = doc(db,"users",currentUser.id);
    await updateDoc(userRef, { blocked:isRecieveBlocked?arrayRemove(user.id):arrayUnion(user.id)});
    changeBlock();
  toast.success(!isRecieveBlocked?`You blocked ${user.username}`:`You unblocked ${user.username}`)
  } catch (error) {
    console.error("Error blocking user:", error);
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

    <button onClick={block} disabled={isCurrentBlocked}>{isCurrentBlocked?"You are blocked":isRecieveBlocked?"UNBLOCK USER":"BLOCK USER"}</button>
    <button className='btn' onClick={logout}>LOG OUT</button>
    </div>
  )
}
