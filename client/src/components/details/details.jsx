import React from 'react'
import "../../styles/details.css"
import harshit from "../../assets/harshit.png";
import arrowd from "../../assets/arrowDown.png";
import download from "../../assets/download.png";
import { auth } from '../../utils/firebase';
import { toast } from 'react-toastify';
import useChatStore from '../../utils/chatState';


export default function Details() {

const {user} = useChatStore();


  return (
    <div className='details'>
    <div className="user">
      <img src={user.dp} alt="" />
      <h2>{user.username}</h2>
      <p> Lorem ipsum, dolor sit amet   </p>
    </div>
    <div className="info">
      <div className="option">
        <div className="title">
         <span> Shared photos </span>
         <img src={arrowd} alt="" />
         </div>
         <div className="photos">
      
          <div className="photoItem">
           
           <div className="mainphoto"> <img src={harshit} alt="" />
             <span>harshit</span></div>
           <img src={download} alt="" />
 
           </div>
       
         </div>
    </div>
    
    </div>

    <button onClick={ ()=>{auth.signOut(); toast.success("Logged out successfully")}}>BLOCK USER</button>
    </div>
  )
}
