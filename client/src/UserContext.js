import {createContext, useEffect, useState} from "react";
import axios from "axios";

// 'createContext' is a method from the 'react' library that allows data to be
// exchanged between different components at different hierarchy levels of the 
// component structure in the App.js file. 
export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    // if it's true that 'user' does not exist, and useEffect determines a render
    // as the initial one, then a get request is made to the server. 
    if (!user) {
      // if the request to the '/profile' endpoint is succesful, the response object is
      // destructured by using the curly bracket notation and taking the "data" 
      // property. A response object is sent by the server as a consequence of the request
      // made. 
      axios.get('/profile').then(({data}) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);
  return (
    // the values within the object "{user, setUser, ready}" are passed to children
    // components that will later require and use these values. The 'user' state variable
    // will be used to conduct specific actions like authenticating the user for example. 
    // 'setUser' will be used to update the value in 'user' from any of the children 
    // components. 'ready' by also be used by other components. In order to access any of 
    // these values, the hook 'useContext' from the 'react' library has to be imported. 
    // This hook allows to take a specific value stored in the context and being passed to 
    // children components. 
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}