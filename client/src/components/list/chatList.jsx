import React, { useEffect, useState } from 'react'
import "../../styles/chatlist.css"
import search from "../../assets/search.png"
import plus from "../../assets/plus.png"
import minus from "../../assets/minus.png"
import AddUser from '../adduser/addUser';
import { doc, onSnapshot,getDoc ,updateDoc } from "firebase/firestore";
import useUserStore from '../../utils/userState';
import useChatStore from '../../utils/chatState';
import { db } from '../../utils/firebase';

export default function ChatList() {

  const [chats , setChats]=useState([])
  const [addMode , setaddMode]=useState(false)
  const [input , setInput]=useState("")
const {currentUser}= useUserStore();
const {fetchChat}= useChatStore();


useEffect(()=>{

   const unsub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
   const items= res.data().chats;

   const promises = items.map(async(item)=>{
    const userDocRef = doc(db, "users", item.recieverId);
      const userDocSnap = await getDoc(userDocRef);
      const user = userDocSnap.data();
      return {...item,user};
   })

   const chatData = await Promise.all(promises)
   setChats(chatData.sort((a,b)=> b.updatedAt- a.updatedAt));

});
return()=>{unsub();}

},[currentUser.id])

const filteredChats = chats.filter(c=> c.user.username.includes(input));

async function fetch(id,user)
{
  const userChat = chats.map((item)=>{
    const { user , ...rest }=item;
    return rest;
  })

  const index = userChat.findIndex(item=>item.chatId===id)
  userChat[index].isSeen=true;
  
  try
  {await updateDoc(doc(db, "userChats", currentUser.id) , {
    chats: userChat,
  })

  fetchChat(id,user);
}
  catch(error)
  {
    console.log(error);
  }
}




  return (
    <div className='chatlist'>
      <div className="search">
        <div className="search-bar">
          <img src={search} alt="" />
          <input type="text" placeholder='Search' onChange={(e)=>{setInput(e.target.value)}}/>
        </div>
        <img src={addMode ? minus:plus} alt="" className='add' onClick={()=>setaddMode(!addMode)}/>
      </div>
     
    { filteredChats.map((chat)=>(
      <div className="item" onClick={()=>{fetch(chat.chatId,chat.user)}} style={{backgroundColor: chat?.isSeen?"transparent":"#5183fe"}}>
       <img src={chat.user.dp} alt="" />
       <div className="texts">
        <span> {chat.user.username}
        </span>
          <p>
              {chat.lastMessage}
          </p>
       </div>
      </div>))}


    {addMode && <AddUser/>}
    </div>
  )
}
