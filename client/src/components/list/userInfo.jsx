import React from 'react'
import "../../styles/userInfo.css"
import more from "../../assets/more.png";
// import edit from "../../assets/edit.png";
import useUserStore from '../../utils/userState';

export default function UserInfo() {

  const{currentUser}=useUserStore();
  return (
    <div className='userinfo'>
    <div className="user">
    <img src={currentUser.dp} alt="   " />
    <h2> {currentUser.username}</h2>
    </div>
        <div className="icon">
            <img src={more} alt="" />
            {/* <img src={edit} alt="" /> */}
        </div>
    </div>
  )
}
