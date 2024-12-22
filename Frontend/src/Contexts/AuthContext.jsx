import React,{Children, createContext,useEffect,useState} from "react";
export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userdetails'));
        const tokenExpiry = userDetails?.expiry;
    
        if (tokenExpiry && tokenExpiry > new Date().getTime()) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, [])

      const logout = () => {
        localStorage.removeItem('UserDetails');
        setIsLoggedIn(false);
        
      };

      const login = (details) => {
        localStorage.setItem('UserDetails', JSON.stringify(details));
        setIsLoggedIn(true);
      };

      return (
        <AuthContext.Provider
          value={{
            isLoggedIn,
            login,
            logout,
          }}
        >
          {children}
        </AuthContext.Provider>
      );
}