import { create } from 'zustand';
import useUserStore from './userState';

const useChatStore = create((set) => ({
  chatId:null,
  user:null,
  isCurrentUserBlocked:false,
  isRecieverBlocked:false,
  fetchChat:(chatId, user) =>{ 
    const currentUser= useUserStore.getState().currentUser;

    if(user.blocked.includes(currentUser.id)) 
    return set({chatId,
        user,
        isCurrentUserBlocked:true,
        isRecieverBlocked:false})
    else if(currentUser.blocked.includes(user.id)) 
    return set({chatId,
        user,
        isCurrentUserBlocked:false,
        isRecieverBlocked:true})
    else 
    return set({chatId,
        user,
        isCurrentUserBlocked:false,
        isRecieverBlocked:false})

   
  },
  changeBlock:()=>{ set(state=>({...state,isRecieverBlocked:!state.isRecieverBlocked}))}
}))

export default useChatStore;
