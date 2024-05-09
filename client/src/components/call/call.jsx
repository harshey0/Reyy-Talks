import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../utils/userState';
import { doc, updateDoc } from "firebase/firestore";
import { db} from "../../utils/firebase.js"
import ringtoneUrl from '../../assets/ringtone.mp3';
import "../../styles/call.css"
import useChatStore from '../../utils/chatState';

const Ringing = (props) => {


    
  const {chatId} = useChatStore();
  const{currentUser}=useUserStore();
    const navigate= useNavigate() 
    const [isRinging, setIsRinging] = useState(true);
    const [ringtone, setRingtone] = useState(new Audio(ringtoneUrl));


useEffect(()=>
{

async function status()
{    const callerRef = doc(db, "users", props.data.callerid);
    await updateDoc(callerRef, { status: "In a call",callStatus: "calling" });}
    status();},[]
)


    useEffect(()=>{

           if(isRinging && ringtone && chatId){
        ringtone.loop = true;
        ringtone.play().catch(error => {
            console.log('Call ended');
        });;}

        return () => {
            if (ringtone) {
                ringtone.pause();
                ringtone.currentTime = 0; 
            
        };
    };},[isRinging , ringtone])
 
 
    const answerCall = async() => {
        const callerRef = doc(db, "users", props.data.callerid);
    await updateDoc(callerRef, { callStatus: "accepted" });
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, { status: "In a call"});
        setIsRinging(false);
        navigate(`/call/${props.data.room}`)
    };

    const rejectCall = async() => {

 
        const callerRef = doc(db, "users", props.data.callerid);
    await updateDoc(callerRef, { callStatus: "rejected" });
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, {
        callStatus: "",
        callType: "",
        caller: "",
        room:'', }); 
        setIsRinging(false);
    };

    return (
        <div className="call-container">
            {isRinging && (
                <div>
                    <p className="caller-name">{props.data.callType} from {props.data.caller}</p>
                    <div className="action-buttons">
                        <button className="answer" onClick={answerCall}>Answer</button>
                        <button className="reject" onClick={rejectCall}>Reject</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ringing;
