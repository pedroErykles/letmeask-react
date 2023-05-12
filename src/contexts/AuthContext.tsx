import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, onAuthStateChange, signInWithGoogle } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
type AuthContentType = {
    user: User | undefined;
    signIn: () => Promise<void>;
  }
  
type AuthContextProviderProps = {
    children: ReactNode; 
}

export const AuthContext = createContext({} as AuthContentType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    useEffect(() => { const unsubscribe = onAuthStateChange(auth, (user) => {
        if(user){
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
        }

        setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
        });
        }
    })
      return () => {
        unsubscribe();
      }
    }, [])

  async function signIn(){
    signInWithGoogle().then(result => {
    if(result){
        const { displayName, photoURL, uid } = result

        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
    }
  });
}

    return(
        <AuthContext.Provider value={{ user, signIn }}>
            {props.children}    
        </ AuthContext.Provider>
    );
}