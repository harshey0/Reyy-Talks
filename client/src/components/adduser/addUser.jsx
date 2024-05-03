import React , { useState} from 'react'
import "../../styles/adduser.css"
import { collection,setDoc, serverTimestamp , doc, getDocs,getDoc, query, where, updateDoc, arrayUnion} from "firebase/firestore";
import {db} from "../../utils/firebase";
import useUserStore from '../../utils/userState';

export default function AddUser() {
  const [user , setUser] = useState(null);
  const {currentUser } = useUserStore();

  async function add()
  {
      const chatRef= collection(db ,"chats" )
      const userChatRef= collection(db ,"userChats" )
       const newChatRef= doc(chatRef);
    try{
      await setDoc(newChatRef,{messages:[], createdAt:serverTimestamp()})
      await updateDoc(doc(userChatRef,user.id),
      {
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage:"",
          recieverId:currentUser.id,
          updatedAt: Date.now()

        })
      })
      await updateDoc(doc(userChatRef,currentUser.id),
      {
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage:"",
          recieverId:user.id,
          updatedAt: Date.now()

        })
      })
    }
    catch(error){
        console.log(error);
    }
  }

  async function search(e)
  {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try{
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot= await getDocs(q);

      const userChatDocRef = doc(collection(db, "userChats"), currentUser.id); 
                const userChatDocSnapshot = await getDoc(userChatDocRef);
              const chats = userChatDocSnapshot.data().chats || []; 
           const hasReceiverId = chats.some(chat => chat.recieverId === querySnapShot?.docs[0]?.data()?.id);
                         

      if(!querySnapShot.empty && (querySnapShot.docs[0].data().username !== currentUser.username) && !hasReceiverId )
      {
        setUser(querySnapShot.docs[0].data())
      }
      else{
        setUser(null)
      }
    }
    catch(error)
    {
      console.log(error);
      setUser(null)
    }
  }
  return (
    <div className='adduser'>
        <form onSubmit={search}>
            <input type="username" placeholder='username' name="username" />
            <button>Search</button>
        </form>
   {  user &&   <div className="user">
            <div className="detail">
                <img src={user.dp} alt="" />
                <span> {user.username}</span>
            </div>
            <button onClick={add}>Add User</button>
        </div>}
    </div>
  )
}
