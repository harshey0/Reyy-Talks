import React from 'react'
import "../../styles/adduser.css"
import harshit from "../../assets/harshit.png";


export default function AddUser() {


  function search(e)
  {
    e.preventDefault();
    

  }
  return (
    <div className='adduser'>
        <form onSubmit={search}>
            <input type="username" placeholder='username' name="username" />
            <button>Search</button>
        </form>
        <div className="user">
            <div className="detail">
                <img src={harshit} alt="" />
                <span>Chirag</span>
            </div>
            <button>Add User</button>
        </div>
    </div>
  )
}
