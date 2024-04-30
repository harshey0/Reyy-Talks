import React ,{useEffect, useRef, useState} from 'react'
import "../../styles/chat.css"
import EmojiPicker from "emoji-picker-react"
import harshit from "../../assets/harshit.png";
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import emoji from "../../assets/emoji.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";

export default function Chat() {

  const [emo , setEmoji] = useState(false)
  const [text , settext] = useState("")
  const endRef=useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, []);

  function emoj(e)
  {
    settext(text + e.emoji )
    setEmoji(false);
  }
  return (
    <div className='chat'>
    <div className="top">
    <div className="user">
      <img src={harshit} alt="" />
      <div className="texts">
        <span>chirag
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
      <div className="message">
        <img src={harshit} alt="" />
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
       
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="my message">
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
       
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="message">
        <img src={harshit} alt="" />
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
      
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="my message">
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
      
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="message">
        <img src={harshit} alt="" />
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
     
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="my message">
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
       
        <span> 1 min ago</span>
        </div>
      </div>
      <div className="message">
        <img src={harshit} alt="" />
        <div className="texts">
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam delectus vero illum doloribus tempore blanditiis consectetur quod id quidem aspernatur, exercitationem adipisci consequuntur dolorum sit expedita eligendi soluta, sequi labore. </p>
      
        <span> 1 min ago</span>
        </div>
      </div>
      <div ref={endRef}></div>
      </div>
        <div className="bottom">
          <div className="icons">
          <img src={img} alt="" />
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
            <button className='send'>
              Send
            </button>
    </div>
    </div>
  )
  }