import React, { useEffect, useRef, useState , useCallback} from 'react';
import "../../styles/videocall.css"
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import useUserStore from '../../utils/userState';

export default function Call() {
    const { roomId } = useParams();
    const { currentUser } = useUserStore();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const pc = useRef(null);
    const socket = useRef();
    const [username, setUsername] = useState(currentUser.username); 
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
 
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

    const sendStreams = useCallback(() => {
        if(localStream)
        for (const track of localStream.getTracks()) {
          pc.current.addTrack(track, localStream);
        }
      }, [localStream]);

      useEffect(() => {

        pc.current.addEventListener("track", async (ev) => {
          const remotestream = ev.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remotestream[0]);
          remoteVideoRef.current.srcObject = remotestream[0];
        });
      }, []);

    useEffect(() => {
        socket.current = io(process.env.URLS);
        socket.current.emit('join_room', { username, roomId });
        console.log("connection")
    
        return () => {
            socket.current.disconnect();
        };
    }, [roomId, username]);

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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log("local stream")
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;
            stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }, [setLocalStream]);

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
        socket.current.emit('offer', { off, to:data.id });
    }, []);

    const handleIncomming = useCallback(async(data) => {

        setRemoteSocketId(data.from);
        const ans = await answer(data.offer);
        socket.current.emit('answer', { ans, to:data.from });
    },[]);

    const handleAnswer = useCallback(async(data) => {
        await description(data.answer)
    },[]);


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
    
        return () => {
            socket.current.off("user_joined",handleUserJoined);
            socket.current.off("incomming",handleIncomming);
            socket.current.off("answer",handleAnswer);
            socket.current.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.current.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [socket , handleUserJoined , handleIncomming , handleAnswer]);

    return (
        <div className='videos'>
        <video ref={localVideoRef} className='video-player' autoPlay playsInline muted />
        <video ref={remoteVideoRef} className='video-player' autoPlay playsInline />
    </div>
    );
    
    }    
