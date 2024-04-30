import React from 'react';
import ChatList from './chatList';
import UserInfo from './userInfo';
import "../../styles/list.css"

export default function List() {
  return (
    <div className='list'>
    <UserInfo/>
    <ChatList/>
    </div>
  )
}
