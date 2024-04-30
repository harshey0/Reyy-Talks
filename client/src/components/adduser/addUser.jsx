import React , { useState} from 'react'
import "../../styles/adduser.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import {db} from "../../utils/firebase";
import useUserStore from '../../utils/userState';


export default function AddUser() {

  const [user , setUser] = useState(null);
  const {currentUser } = useUserStore();


  async function search(e)
  {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try{
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));
      const querySnapShot= await getDocs(q);

      if(!querySnapShot.empty && querySnapShot.docs[0].data().username !== currentUser.username)
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
            <button>Add User</button>
        </div>}
    </div>
  )
}
