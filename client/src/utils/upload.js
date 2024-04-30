import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default async function uploads(file)
{const storage = getStorage();
    const date = new Date();
const storageRef = ref(storage, `images/${date + file.name}`);

const uploadTask = uploadBytesResumable(storageRef, file);

return new Promise((resolve,reject)=>{
uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
   
  }, 
  (error) => {
    reject("Something went wrong")
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      console.log('File available at', downloadURL);
    });
  }
);})}