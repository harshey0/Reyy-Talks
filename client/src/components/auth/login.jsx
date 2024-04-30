import React , {useState} from 'react';
import "../../styles/login.css"
import favicon from "../../assets/favicon.png"
import { toast } from 'react-toastify';
import { auth ,db} from '../../utils/firebase';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth'; 
import { doc, setDoc ,collection, getDocs, query, where } from "firebase/firestore"; 
import uploads from '../../utils/upload';

export default function Login() {

    const [dp,setdp]= useState({file:null, url:""})
    const [loading,setLoading]= useState(false)

    function profilepic(e)
    {
        if(e.target.files[0])
        setdp({file:e.target.files[0],url:URL.createObjectURL(e.target.files[0])})
    }

   async function login(e)
    {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target)
        const { email , password} = Object.fromEntries(formData);
        try{
             await signInWithEmailAndPassword(auth,email,password)
              toast.success("Successfully logged in")
        }
        catch(error)
        {
            toast.error(error.message)
        }
        finally{
            setLoading(false);
        }
    }
    async function register(e)
    {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target)
        const {username , email , password} = Object.fromEntries(formData);
        if (!username || !email || !password)
       { toast.warn("Please enter inputs!");
       return setLoading(false)
    }
        if (!dp.file) {toast.warn("Please upload an avatar!")
        return setLoading(false)}
        const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.warn("username already taken");
      return setLoading(false)
    }
        try{
            const res = await createUserWithEmailAndPassword(auth,email,password)
            const imgURL = await uploads(dp.file)
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                dp:imgURL,
                id:res.user.uid,
                blocked:[]
              });
            await setDoc(doc(db, "userChats", res.user.uid), {
            
                chats:[],
              });
              toast.success("Account Created! You can login now.")
        }
        catch(error)
        {
            toast.error(error.message)
        }
        finally{
            setLoading(false);
        }
    }



  return (
    <div className='login'>
    <div className="item">
        <h2>Login Form</h2>
        <form onSubmit={login}>
            <input type="email" placeholder='Email' name='email'  />
            <input type="password" placeholder='Password' name='password'  />
            <button disabled={loading}>{loading? "Loading" : "Sign In"}</button>
        </form>
    </div>
    <div className="seperator"></div>
    <div className="item">
    <h2>Register Form</h2>
        <form onSubmit={register}>
        <label htmlFor="file"> <img src={dp.url||favicon} alt="" />Upload Profile picture</label>
       
            <input type="file" id='file'  style={{display:"none"}}  onChange={profilepic}/>
            <input type="username" placeholder='Username' name='username'  />
            <input type="email" placeholder='Email' name='email'  />
            <input type="password" placeholder='Password' name='password'  />
            <button disabled={loading}>{loading? "Loading" : "Sign Up"}</button>
        </form>
    </div>
    </div>
  )
}
