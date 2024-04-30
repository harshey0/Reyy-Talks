import React, { useEffect, useState } from 'react'
import "../../styles/chatlist.css"
import harshit from "../../assets/harshit.png";
import search from "../../assets/search.png"
import plus from "../../assets/plus.png"
import minus from "../../assets/minus.png"
import AddUser from '../adduser/addUser';
import { doc, onSnapshot,getDoc  } from "firebase/firestore";
import useUserStore from '../../utils/userState';
import { db } from '../../utils/firebase';

export default function ChatList() {

  const [chats , setChats]=useState([])
  const [addMode , setaddMode]=useState(false)

const {currentUser}= useUserStore();


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






  return (
    <div className='chatlist'>
      <div className="search">
        <div className="search-bar">
          <img src={search} alt="" />
          <input type="text" placeholder='Search'/>
        </div>
        <img src={addMode ? minus:plus} alt="" className='add' onClick={()=>setaddMode(!addMode)}/>
      </div>
     
    { chats.map(chat=>(
      <div className="item">
       <img src={harshit} alt="" />
       <div className="texts">
        <span> Chirag
        </span>
          <p>
              Hello
          </p>
       </div>
      </div>))}


    {addMode && <AddUser/>}
    </div>
  )
}
