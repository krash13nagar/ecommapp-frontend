import {useState,createContext,useEffect,useContext} from 'react';

const AuthContext=createContext();

const AuthProvider=({children})=>{
    const [auth,setAuth]=useState({
        user:null,
        token:""
    });

    useEffect(()=>{
        const data=localStorage.getItem('auth');
        if(data){
            const ParsedData=JSON.parse(data);
            setAuth({...auth,
                user:ParsedData.user,
                token:ParsedData.token
            });
        }
        // eslint-disable-next-line 
    },[])
    

    return(
        <AuthContext.Provider value={{auth,setAuth}}>
            {children}

        </AuthContext.Provider>
    )
}


const useAuth=()=>useContext(AuthContext);
export {useAuth,AuthProvider};