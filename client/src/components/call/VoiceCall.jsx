import React, { useEffect, useRef, useState , useCallback} from 'react';
import "../../styles/voicecall.css"
import io from "socket.io-client";
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../utils/userState';
import { toast } from 'react-toastify';
import {db} from "../../utils/firebase.js"
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import dialUrl from '../../assets/dialtone.mp3';
import useChatStore from '../../utils/chatState';

export default function Vcall() {



  const { user  } = useChatStore();
    const { roomId } = useParams();
    const [isRinging, setIsRinging] = useState(false);
    const { currentUser } = useUserStore();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const pc = useRef(null);
    const socket = useRef();
    const navigate = useNavigate();
    const remoteAudioRef = useRef(null);
    const [dp , setdp] = useState();
    const [localStream , setLocalStream] = useState();
    const [remoteStream , setRemoteStream] = useState();

    async function clearall()
    {
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, {
            callStatus: "",
            status: "online",
            callType: "",
            caller: "",
            room:'', }); 
    }

    function end()
    {
        
                        pc.current.close(); 
                        navigate(-1);
                        socket.current.emit("left",{to:remoteSocketId});
    }

    useEffect(() => {
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.id);
            const unsubscribe = onSnapshot(userRef, async(doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                     if (userData.callStatus === "accepted") {
                        toast("Call accepted");
                        setIsRinging(false)
                    } else if (userData.callStatus === "rejected") {
                        toast("Call rejected");
                        setIsRinging(false)
                      await clearall();
                      end();
                    }
                    else if (userData.callStatus === "calling")
                    {
                        toast("calling");
                        setIsRinging(true)

                    }
                }
            });
            return () => unsubscribe();
        }
    }, []);
    
    
 
    useEffect(() => {
        const createPeerConnection = async () => {
            try {
                const ppc = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.stunprotocol.org' },
                        { urls: 'stun:stun.l.google.com:19302' },
                    ],
                });
                console.log("peer connection")
                pc.current = ppc;


            } catch (error) {
                console.error('Error creating peer connection:', error);
            }
        };

        createPeerConnection();

        return () => {
            if (pc.current) {
                pc.current.close();
            }
        };
    }, []);


      useEffect(() => {

        pc.current.addEventListener("track", async (ev) => {
          const remotestream = ev.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remotestream[0])
          remoteAudioRef.current.srcObject = remotestream[0];
        });
      }, []);

      useEffect(()=>{
        let  ringtone = new Audio(dialUrl);
           if(isRinging){
        ringtone.loop = true;
        ringtone.play().catch(error => {
            console.log('Error playing ringtone:', error);
        });;}

        return () => {
            if (ringtone) {
                ringtone.pause();
                ringtone.currentTime = 0; 
            
        };
    };},[isRinging])

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_URLS);
        socket.current.emit('join_room', { roomId });
        console.log("connection")
    
        return () => {
            socket.current.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        socket.current.on("join_room", async() => {
            console.log("room joined")
        await handleCallUser(); 
        });
        return () => {
            socket.current.off("join_room");
        };
    }, []);

    const handleCallUser = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true });
            console.log("local stream")
            setLocalStream(stream);
            stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }, []);

    const sendStreams = useCallback(() => {
        if(localStream)
        for (const track of localStream.getTracks()) {
          pc.current.addTrack(track, localStream);
        }
      }, [localStream]);


        async function offer()
        {
        try{
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
        catch(error)
        {
            console.log("error creating an offer")
        }

        }
        async function answer(off )
        {
        try{
            await pc.current.setRemoteDescription(off);
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(new RTCSessionDescription(answer));
            console.log("answer")
            return answer;
        }
        catch(error)
        {
            console.log("error creating an answer")
        }
        }

        async function description(answer) {
            try {
                await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
                console.log("description");
                sendStreams();
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
        

    const handleUserJoined = useCallback(async(data) => {
        console.log("someone joined")
        setRemoteSocketId(data.id);
        const off = await offer();
        console.log("offer")
        socket.current.emit('offer', { off, to:data.id , photo:currentUser.dp});
    }, []);

    const handleIncomming = useCallback(async(data) => {

        setRemoteSocketId(data.from);
        const ans = await answer(data.offer);
        setdp(data.photo)
        socket.current.emit('answer', { ans, to:data.from , photo:currentUser.dp });
    },[]);

    const handleAnswer = useCallback(async(data) => {
        await description(data.answer)
        setdp(data.photo)
    },[]);

    const handleUserLeft = useCallback(async() => {
        console.log("User left the call");

        await clearall();
            end();
            toast("Call ended")
    }, [remoteSocketId]);
    

    const handleNegoNeeded = useCallback(async () => {
        const off = await offer();
        socket.current.emit("peer:nego:needed", { off, to: remoteSocketId });
      }, [remoteSocketId, socket]);
    
      useEffect(() => {
        pc.current.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
          pc.current.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
      }, [handleNegoNeeded]);
    
      const handleNegoNeedIncomming = useCallback(
        async ({ from, off }) => {
          const ans = await answer(off);
          socket.current.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
      );
    
      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await description(ans);
      }, []);

    useEffect(() => {
        
        socket.current.on("user_joined",handleUserJoined);
        socket.current.on("incomming",handleIncomming);
        socket.current.on("answer",handleAnswer);
        socket.current.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.current.on("peer:nego:final", handleNegoNeedFinal);
        socket.current.on("user_left", handleUserLeft);
    
        return () => {
            socket.current.off("user_joined",handleUserJoined);
            socket.current.off("incomming",handleIncomming);
            socket.current.off("answer",handleAnswer);
            socket.current.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.current.off("peer:nego:final", handleNegoNeedFinal);
            socket.current.off("user_left", handleUserLeft);
        };
    }, [socket , handleUserJoined , handleIncomming , handleAnswer , handleNegoNeedIncomming , handleNegoNeedIncomming , handleUserLeft]);

    return (
        <div className='audio'>
          <img className='imgcall' src={currentUser.dp}></img>
          <img className='imgcall' src={dp||user?.dp||currentUser.dp}></img>
          {remoteStream && (
    <audio autoPlay controls ref={remoteAudioRef}> 
        <source type="audio/ogg" />
        Your browser does not support the audio element.
    </audio>
)}
        <div className="controls">
        <button onClick={() => {
            
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => {
        track.enabled = !track.enabled;
    });
}}>
    Mic
</button>
            <button onClick={async() => {
             await clearall();
             await updateDoc(doc(db, "users", user?.id), {
        callStatus: "",
        callType: "",
        caller: "",
        room:"",
        callerid:"",
        status:"online"
      });
             end();
             toast("Call ended")
                }}>
                End Call
            </button>
        </div>
    </div>
    );
    
    }    
