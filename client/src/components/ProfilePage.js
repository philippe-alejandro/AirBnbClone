import { useContext, useState } from "react";
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import axios from "axios";
import AccountNavigation from "./AccountNavigation";

export default function ProfilePage() {
  // redirect will take the user to the homepage after logging in.
  const [redirect, setRedirect] = useState(null);
  // these properties are destructued from the UserContext.Provider object
  // which passes down its values to child components. "ProfilePage" is one
  // of those components. 
  const { ready, user, setUser } = useContext(UserContext);
  // useParams is a hook that allows to access the "params" object of the "Route"
  // component. Here, it's accessing the "subpage" parameter from the URL located
  // in the "route" of the "Route" component. It's purpose in this case is to determine
  // which subpage should be displayed in the "/profile" endpoint. 
  let {subpage} = useParams();
  // if the "subpage" value has not value, then the profile page will be displayed.
  if (subpage === undefined) {
    subpage = "profile";
  }

  // when the logout button is cliked, the user is redirected to the logout page.
  // The state variables are also modified. 
  async function logOut() {
    await axios.post("/logout");
    setRedirect('/');
    setUser(null);
  }
  // this message is momentarily displayed while the "ready" variable is set to true.
  if (!ready) {
    return "Loading...";
  }
  // user is sent to login page if "ready" is true and "user" and "redirect" have
  // no values. 
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"}/>
  }

  // if there is a redirect value the user will be taken to another component. 
  // In this case, it will be taken to the logout page. 
  if (redirect) {
    return <Navigate to={redirect}/>
  }

  return (
    <div>    
      {/*
        "AccountNavigation" is imported and used as a separate component to improve
        maintainability and modularity in the app. 
      */}
      <AccountNavigation/>
      {/*
        if subpage equals "profile" then the elements below are displayed. 
      */}
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br/>
        <button onClick={logOut} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === "places" && (
        <PlacesPage/>
      )
      }
    </div>
  );
}