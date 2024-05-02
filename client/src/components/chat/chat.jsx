import React ,{useEffect, useRef, useState} from 'react'
import "../../styles/chat.css"
import { doc, onSnapshot,getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {db} from "../../utils/firebase.js"
import EmojiPicker from "emoji-picker-react"
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import emoji from "../../assets/emoji.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";
import useChatStore from '../../utils/chatState';
import useUserStore from '../../utils/userState';
import uploads from '../../utils/upload';

export default function Chat() {

  const {chatId , user } = useChatStore();
  const {currentUser } = useUserStore();
  const [chat , setChat] = useState()
  const [emo , setEmoji] = useState(false)
  const [text , settext] = useState("")
  const [image, setimg] = useState({file:"",url:""})
  const [currentTime, setCurrentTime] = useState(new Date());
  const endRef=useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [chat]);

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
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);})
  
    function pic(e)
    {
        if(e.target.files[0])
        setimg({file:e.target.files[0],url:URL.createObjectURL(e.target.files[0])})
    }

  async function send()
  {
      if(image.file)
   { try{
    const imgURL = await uploads(image.file);
    await updateDoc(doc(db,"chats", chatId),
      {
        messages:arrayUnion({
          senderId:currentUser.id,
          img:imgURL,
          createdAt:new Date(),
        })
      })
      const userIds =[currentUser.id , user.id]
      userIds.forEach(async(id)=>
      {const userChatRef = doc(db , "userChats" , id);
      const userChatsSnapshot = await getDoc(userChatRef);
      const userChatData = userChatsSnapshot.data();
      const index = userChatData.chats.findIndex(c=>c.chatId===chatId)
      userChatData.chats[index].lastMessage="sent an image";
      userChatData.chats[index].isSeen=id===currentUser.id?true:false;
      userChatData.chats[index].updatedAt=Date.now();
      await updateDoc(userChatRef , {
        chats: userChatData.chats,
      })})
      setimg({file:"", url:""});
      endRef.current?.scrollIntoView({ behavior: 'smooth'});
    }
    catch(error)
    {
      console.log(error)
    }}
     else if(text==="")
     return;
     else
     {try{
      await updateDoc(doc(db,"chats", chatId),
      {
        messages:arrayUnion({
          senderId:currentUser.id,
          text,
          createdAt:new Date(),
        })
      })
      const userIds =[currentUser.id , user.id]
      userIds.forEach(async(id)=>
      {const userChatRef = doc(db , "userChats" , id);
      const userChatsSnapshot = await getDoc(userChatRef);
      const userChatData = userChatsSnapshot.data();
      const index = userChatData.chats.findIndex(c=>c.chatId===chatId)
      userChatData.chats[index].lastMessage=text;
      userChatData.chats[index].isSeen=id===currentUser.id?true:false;
      userChatData.chats[index].updatedAt=Date.now();
      await updateDoc(userChatRef , {
        chats: userChatData.chats,
      })})
      endRef.current?.scrollIntoView({ behavior: 'smooth'});
      settext("");}
     catch(error)
     {
      console.log(error);
     }}
  }

  function formatTimeDifference(time) {
    const createdAt = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
    const now = currentTime;
    const diffMs = now - createdAt;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} min ago`;
    } else {
      return 'Just now';
    }
  }

  function emoj(e)
  {
    settext(text + e.emoji )
    setEmoji(false);
  }

  return (
    <div className='chat'>
    <div className="top">
    <div className="user">
      <img src={user.dp} alt="" />
      <div className="texts">

        <span>{user.username}
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
          </p>
        </span>
      </div>
    </div>
    <div className="icons">
      <img src={phone} alt="" />
      <img src={video} alt="" />
      <img src={info} alt="" />
    </div>

    </div>
      <div className="center">
   { image.url?( <img src={image.url} className="checkImage"/>) : (chat?.messages.map((message)=>
      (

      <div className={message.senderId===currentUser.id?"mymessage":"message"} key={message?.createdAt}>
        {message.senderId===currentUser.id?"":<img src={user.dp} />}
        <div className="texts">
        {message.img && <img src={message.img} />}
          {message.text && <p>{message.text}</p>}
      
        <span>{formatTimeDifference(message.createdAt)}</span>
        </div>
      </div>)))}
      <div ref={endRef}></div>
      </div>
        <div className="bottom">
          <div className="icons">
          <label htmlFor='file'>
          <img src={img} alt="" />
          </label>
          <input type="file" id='file' style={{display:"none"}} onChange={pic} />

          <img src={camera} alt="" />
          <img src={mic} alt="" />

          </div>
            <input type="text" value={text} placeholder='Type a message...' onChange={(e)=>settext(e.target.value)}/>
            <div className="emoji">
              <img src={emoji} alt="" onClick={()=>setEmoji(!emo)}/>
              <div className="picker">
              <EmojiPicker open={emo} onEmojiClick={emoj}/>
              </div>
            </div>
            <button className='send' onClick={send}>
              Send
            </button>
    </div>
    </div>
  )
  }