import React, { useEffect, useRef, useState , useCallback} from 'react';
import "../../styles/videocall.css"
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import useUserStore from '../../utils/userState';
import ReactPlayer from "react-player";

export default function Call() {
    const { roomId } = useParams();
    const { currentUser } = useUserStore();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const pc = useRef(null);
    const socket = useRef();
    const [remote, setRemote] = useState(null);
    const [username, setUsername] = useState(currentUser.username); 

 
    


    useEffect(() => {
        socket.current = io('http://localhost:5000');
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
            await createPeerConnection();
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log("local stream")
            setLocalStream(stream);
            stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }, [setLocalStream]);

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

            pc.current.ontrack = event => {
                setRemoteStream(event.streams[0]);
            };
            
        } catch (error) {
            console.error('Error creating peer connection:', error);
        }
    };

        async function offer(to)
        {
        try{
            const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        console.log("offer")
        socket.current.emit('offer', { offer, to });}
        catch(error)
        {
            console.log("error creating an offer")
        }

        }
        async function answer(offer , from)
        {
        try{
            await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.current.createAnswer();
            console.log("answer")
            await  pc.current.setLocalDescription(answer);
            socket.current.emit('answer', { answer, to:from });
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
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
        

    const handleUserJoined = useCallback((data) => {
        console.log("someone joined")
        setRemote(data.id);
        offer(data.id);
    }, [setRemote]);

    const handleIncomming = useCallback((data) => {
        setRemote(data.from)
        answer(data.offer , data.from)
    },[setRemote]);

    const handleAnswer = useCallback((data) => {
        description(data.answer)
    },[]);

    useEffect(() => {
        
        socket.current.on("user_joined",handleUserJoined);
        socket.current.on("incomming",handleIncomming);
        socket.current.on("answer",handleAnswer);
    
        return () => {
            socket.current.off("user_joined",handleUserJoined);
            socket.current.off("incomming",handleIncomming);
            socket.current.off("answer",handleAnswer);
        };
    }, [socket , handleUserJoined , handleIncomming , handleAnswer]);


    return (
        <div className='videos'>

            <ReactPlayer url={localStream} className='video-player' playing muted />
            <ReactPlayer url={remoteStream } className='video-player' playing />
        </div>
    );
};
